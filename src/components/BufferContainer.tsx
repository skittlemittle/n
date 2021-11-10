import React from "react";

import Buffer from "./Buffer";
import BufferGap from "../lib/bufferGap";
import { KeyboardEvents, EventCategory } from "../lib/keyboardEvents";
import { MarkList } from "../lib/mark";
import ClipBoard from "../lib/clipBoard";

enum Mode {
  Normal,
  Insert,
  Visual,
}

interface State {
  text: string;
  point: number;
}

interface Props {
  bufferGap: BufferGap;
  initPoint: number;
  save: (point: number) => void;
  mode: Mode;
  visualMarks: MarkList;
  clipBoard: ClipBoard;
  returnToNormal: () => void;
}

/** handles editing interactions with a buffer */
class BufferContainer extends React.Component<Props, State> {
  private bufferGap: BufferGap;
  private visMarks: MarkList;
  private KeventID: number;
  private selectStart: string; // visual mode select marker

  constructor(props: Props) {
    super(props);
    this.KeventID = -1;
    // save me from long ass names
    this.bufferGap = this.props.bufferGap;
    this.visMarks = this.props.visualMarks;
    this.state = {
      text: this.bufferGap.getContents(),
      point: this.props.initPoint,
    };
    this.selectStart = "";
  }

  componentDidMount() {
    this.KeventID = KeyboardEvents.addListener(
      EventCategory.Buffer,
      this.handleKeyPress
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.mode !== prevProps.mode) this.initMode(this.props.mode);
  }

  componentWillUnmount() {
    this.props.save(this.state.point);
    KeyboardEvents.removeListener(this.KeventID);
  }

  /** initialise stuff on mode changes */
  private initMode(mode: Mode) {
    if (mode === Mode.Visual) {
      this.selectStart = this.visMarks.createMark(this.state.point);
    }
  }

  /** deal with ctrl+v in insert mode */
  private handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    if (this.props.mode === Mode.Insert) {
      const paste = e.clipboardData?.getData("text");
      this.bufferGap.insert(paste, this.state.point);
      this.setState({
        text: this.bufferGap.getContents(),
        point: this.state.point + paste.length,
      });
    }
  }

  private handleKeyPress = (e: KeyboardEvent, keys: string) => {
    switch (e.key) {
      case "End":
        this.setState({
          point:
            this.state.point + this.distanceToNewLine(this.state.point, true),
        });
        break;
      case "Home":
        this.setState({
          point:
            this.state.point - this.distanceToNewLine(this.state.point, false),
        });
        break;
      case "ArrowLeft":
        this.setState({ point: this.decrementPoint(1) });
        break;
      case "ArrowRight":
        this.setState({ point: this.incrementPoint(1) });
        break;
      case "ArrowUp":
        this.movePointUp();
        break;
      case "ArrowDown":
        this.movePointDown();
        break;
      default:
        if (this.props.mode === Mode.Insert) this.insert(e);
        else if (this.props.mode === Mode.Normal) this.normal(e);
        else if (this.props.mode === Mode.Visual) this.visual(e);
        break;
    }
    this.setState({ text: this.bufferGap.getContents() });
  };

  private insert(e: KeyboardEvent, keys?: string) {
    switch (e.key) {
      case "Enter":
        this.bufferGap.insert("\n", this.state.point);
        this.setState({ point: this.state.point + 1 });
        break;
      case "Delete":
        this.bufferGap.delete(true, 1, this.state.point);
        break;
      case "Backspace":
        this.bufferGap.delete(false, 1, this.state.point);
        this.setState({ point: this.decrementPoint(1) });
        break;
      case "Tab":
        e.preventDefault();
        e.stopPropagation();
        this.bufferGap.insert("    ", this.state.point);
        this.setState({ point: this.state.point + 4 });
        break;
      default:
        this.bufferGap.insert(e.key, this.state.point);
        this.setState({ point: this.state.point + 1 });
        break;
    }
  }

  private normal(e: KeyboardEvent, keys?: string) {}

  private visual(e: KeyboardEvent, keys?: string) {
    let exit = false;
    switch (e.key) {
      case "y":
        this.yank(this.selectStart);
        exit = true;
        break;
      case "d":
        this.delete(this.selectStart);
        exit = true;
        break;
      default:
        break;
    }
    if (exit) this.props.returnToNormal();
  }

  render() {
    return (
      <Buffer
        onPaste={(e) => this.handlePaste(e)}
        text={this.state.text}
        point={this.state.point}
      />
    );
  }

  //============ visual ====================================================
  /** copy the text between a mark and the point to the clipboard
   * @param name: marks name
   * @param del: set to true to delete the text, false to leave it be
   * @return true on success, false if the mark doesnt exist
   */
  private yank(name: string, del = false): boolean {
    let p = this.state.point;
    const wasBefore = this.visMarks.pointBeforeMark(p, name);
    // make sure the point is before the mark
    if (!wasBefore) {
      const maybeP = this.visMarks.swapPointAndMark(p, name);
      if (maybeP !== false) p = maybeP;
      else return false;
    }

    const l = this.visMarks.whereIs(name);
    if (l !== undefined) {
      const t = this.bufferGap.getSection(p, l);
      this.props.clipBoard.paste(t);
      navigator.clipboard.writeText(t);
      if (del) {
        this.bufferGap.delete(true, l - p, p);
        this.setState({ point: p });
      }
    } else {
      return false;
    }
    // ok clean up now
    this.visMarks.removeMark(name);
    this.selectStart = "";
    return true;
  }

  /** delete and yank the selected text
   * @param name: select marks name
   */
  private delete(name: string): boolean {
    return this.yank(name, true);
  }

  //============ helpers====================================================

  private decrementPoint(i: number) {
    return this.state.point === 0 ? 0 : this.state.point - i;
  }

  private incrementPoint(i: number) {
    //prettier-ignore
    return this.state.point === this.state.text.length ? this.state.point : this.state.point + i;
  }

  /** distance to the next "\n"
   * @param p the point to start the measurement from
   * @param direction which direction to look in. true = right, false = left
   * @returns the distance to the next newline or the borders of the text.
   */
  private distanceToNewLine(p: number, direction: boolean): number {
    const step = direction ? 1 : -1;
    let seek = p;
    let distance = 0;
    while (true) {
      if (seek + step < 0 || seek + step > this.state.text.length) break;
      if (seek + step === this.state.text.length || seek + step === 0) {
        distance++;
        break;
      }
      if (this.state.text[seek + step] === "\n") {
        if (direction) distance++; // stop after the \n if going right
        break;
      }
      distance++;
      seek += step;
    }
    return distance;
  }

  private movePointUp() {
    // go two newlines up then add till at target col or at line end.
    let p = this.state.point;
    const d1 = this.distanceToNewLine(p, false);
    p -= d1 + 1;
    if (p > 0) {
      const d2 = this.distanceToNewLine(p, false);
      p -= d2;
      p += Math.min(d2, d1);
      this.setState({ point: p });
    }
  }

  private movePointDown() {
    let p = this.state.point;
    const column = this.distanceToNewLine(p, false);
    const nextN = this.distanceToNewLine(p, true);
    const nextLineLen = this.distanceToNewLine(p + nextN, true);

    if (this.state.text[p] === "\n") {
      p += nextN;
    } else {
      const newColumn = nextLineLen > column ? column : nextLineLen - 1;
      p += nextN + 1 + newColumn;
    }
    if (p <= this.state.text.length) this.setState({ point: p });
  }
}

export { BufferContainer, Mode };
