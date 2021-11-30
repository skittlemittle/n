import React from "react";

import Buffer from "./Buffer";
import BufferGap from "../lib/bufferGap";
import { KeyboardEvents, EventCategory } from "../lib/keyboardEvents";
import { MarkList } from "../lib/mark";
import AppClipBoard from "../lib/clipBoard";
import { toggleRendred } from "./SplitManager";

enum Mode {
  Normal,
  Insert,
  Visual,
  Visual_Line,
  Visual_Block,
}

interface State {
  text: string;
  point: number;
  mode: Mode;
}

interface Props {
  bufferGap: BufferGap;
  initPoint: number;
  save: (point: number) => void;
  initMode: Mode;
  clipBoard: AppClipBoard;
  marks: MarkList;
  saveMode: (m: Mode) => void;
  toggleRendered: toggleRendred;
}

interface VisualMarks {
  /** location of the point when visual mode is started */
  selectStart: string;
  /** the beginning of the line selectStart is on */
  lineStart: string;
  /** the end of the line selectStart is on */
  lineEnd: string;
}

/** handles editing interactions with a buffer */
class BufferContainer extends React.Component<Props, State> {
  private bufferGap: BufferGap;
  private marks: MarkList;
  private KeventID: number;
  private visMarks: VisualMarks;

  constructor(props: Props) {
    super(props);
    this.KeventID = -1;
    // save me from long ass names
    this.bufferGap = this.props.bufferGap;
    this.marks = this.props.marks;
    this.visMarks = {
      selectStart: "",
      lineStart: "",
      lineEnd: "",
    };

    this.state = {
      text: this.bufferGap.getContents(),
      point: this.props.initPoint,
      mode: this.props.initMode,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.KeventID = KeyboardEvents.addListener(
        EventCategory.Buffer,
        this.handleKeyPress
      );
    }, 300);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.mode !== prevState.mode) this.initMode(this.state.mode);
  }

  componentWillUnmount() {
    this.props.save(this.state.point);
    KeyboardEvents.removeListener(this.KeventID);
  }

  /** initialise stuff on mode changes */
  private initMode(mode: Mode) {
    if (mode === Mode.Visual) {
      this.visMarks.selectStart = this.marks.createMark(this.state.point);
    } else if (mode === Mode.Visual_Line) {
      this.visMarks.lineStart = this.marks.createMark(
        this.state.point - this.distanceToNewLine(this.state.point, false)
      );
      this.visMarks.lineEnd = this.marks.createMark(
        this.state.point + this.distanceToNewLine(this.state.point, true)
      );
    }
  }

  /** deal with ctrl+v in insert mode */
  private handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    if (this.state.mode === Mode.Insert) {
      const paste = e.clipboardData?.getData("text");
      this.bufferGap.insert(paste, this.state.point);
      this.setState({
        text: this.bufferGap.getContents(),
        point: this.state.point + paste.length,
      });
    }
  }

  private handleKeyPress = (e: KeyboardEvent, keys: string) => {
    let renderBuffer = false;
    switch (keys) {
      case "Control,q":
        renderBuffer = true;
        break;
      default:
        break;
    }
    if (renderBuffer) {
      this.props.toggleRendered(true);
      return;
    }

    // single key stuff
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
      case "Escape":
        if (this.state.mode !== Mode.Normal)
          this.setState({ mode: Mode.Normal });
        break;
      default:
        if (this.state.mode === Mode.Insert) this.insert(e);
        else if (this.state.mode === Mode.Normal) this.normal(e, keys);
        else if (
          this.state.mode === Mode.Visual ||
          this.state.mode === Mode.Visual_Line ||
          this.state.mode === Mode.Visual_Block
        )
          this.visual(e, keys);
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

  private normal(e: KeyboardEvent, keys?: string) {
    let comboHappened = false;
    switch (keys) {
      case "Shift,V":
        this.setState({ mode: Mode.Visual_Line });
        comboHappened = true;
        break;
      case "Control,v":
        this.setState({ mode: Mode.Visual_Block });
        comboHappened = true;
        break;
      default:
        break;
    }
    if (comboHappened) return;
    switch (e.key) {
      case "i":
        this.setState({ mode: Mode.Insert });
        break;
      case "v":
        this.setState({ mode: Mode.Visual });
        break;
      default:
        break;
    }
  }

  private visual(e: KeyboardEvent, keys?: string) {
    let exit = false;
    const { point, mark } = this.chooseVisualRegion();
    switch (e.key) {
      case "y":
        this.doOverRegion(mark, point, this.yank);
        exit = true;
        break;
      case "d":
        this.doOverRegion(mark, point, this.delete);
        exit = true;
        break;
      default:
        break;
    }
    if (exit) {
      this.visMarks.selectStart = "";
      this.visMarks.lineEnd = "";
      this.visMarks.lineStart = "";
      this.setState({ mode: Mode.Normal });
    }
  }

  render() {
    return (
      <Buffer
        onPaste={(e) => this.handlePaste(e)}
        text={this.state.text}
        point={this.state.point}
        mode={this.state.mode}
      />
    );
  }

  //============ commands ====================================================
  /** yank text in a region
   * @param start: location to start deleting from
   * @param end: location to end on
   */
  private yank = (start: number, end: number) => {
    const t = this.bufferGap.getSection(start, end);
    this.props.clipBoard.paste(t);
    navigator.clipboard.writeText(t);
  };
  /** delete and yank text in a region
   * @param start: location to start deleting from
   * @param end: location to end on
   */
  private delete = (start: number, end: number) => {
    this.yank(start, end);
    this.bufferGap.delete(true, end - start, start);
    this.setState({ point: start });
  };

  //============ helpers====================================================

  /** do something over the region of text between the mark and pointer, action performed by callback
   * @param name: marks name
   * @param point: specify a point, defaults to current point location.
   * @param callback: action to perform over region
   * @return true on success, false if the mark doesnt exist
   */
  private doOverRegion(
    name: string,
    point = this.state.point,
    callback: (start: number, end: number) => void | boolean
  ): boolean {
    let p = point;
    const wasBefore = this.marks.pointBeforeMark(p, name);
    // make sure the point is before the mark
    if (!wasBefore) {
      const maybeP = this.marks.swapPointAndMark(p, name);
      if (maybeP !== false) p = maybeP;
      else return false;
    }

    const l = this.marks.whereIs(name);
    if (l !== undefined) {
      if (callback(p, l) === false) return false;
    } else {
      return false;
    }
    // ok clean up now
    this.marks.removeMark(name);
    return true;
  }

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

  /** returns the name of the furthest mark from a point */
  private furthestFrom = (p: number, marks: string[]) => {
    let name = marks[0];
    let f = 0;

    for (let i of marks) {
      const m = this.marks.getMark(i)?.location;
      if (m !== undefined) {
        const d = Math.abs(p - m);
        if (d > f) {
          f = d;
          name = i;
        }
      }
    }
    return name;
  };

  /** choose the point and mark to operate on for the visual modes
   * @return {point, mark} the point and mark
   */
  private chooseVisualRegion = () => {
    const p = this.state.point;
    let point: number, mark: string;
    if (this.state.mode === Mode.Visual) {
      // ===visual===
      mark = this.visMarks.selectStart;
      point = p;
    } else {
      // ===visual line===
      const lineStart =
        this.marks.getMark(this.visMarks.lineStart)?.location || p;
      // point before line visual mode was started on
      if (p - lineStart < 0) {
        point = p - this.distanceToNewLine(p, false);
      } else {
        // point on or after line visual mode was started on
        point = p + this.distanceToNewLine(p, true);
      }
      mark = this.furthestFrom(point, [
        this.visMarks.lineStart,
        this.visMarks.lineEnd,
      ]);
    }
    return { point, mark };
  };
}

export { BufferContainer, Mode };
