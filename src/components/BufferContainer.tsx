import React from "react";

import Buffer from "./Buffer";
import BufferGap from "../lib/bufferGap";
import {
  KeyboardEvents,
  EventCategory,
  bufferIgnored,
} from "../lib/keyboardEvents";
import { MarkList } from "../lib/mark";
import AppClipBoard from "../lib/clipBoard";
import { toggleRendred } from "./SplitManager";
import { CommandBuffer, commands, makeCommand } from "../lib/commands";

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
  /** save the editors state / the file
   * @param point: location of point
   * @param write: if true the file is written
   */
  save: (point: number, write: boolean) => void;
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
  private KeventIDs: number[];
  private visMarks: VisualMarks;
  private commandRepeat: string;
  private commandBuffer: CommandBuffer;
  private bufferRef;

  constructor(props: Props) {
    super(props);
    this.KeventIDs = [];
    // save me from long ass names
    this.bufferGap = this.props.bufferGap;
    this.marks = this.props.marks;
    this.visMarks = {
      selectStart: "",
      lineStart: "",
      lineEnd: "",
    };
    this.commandRepeat = "";
    this.commandBuffer = makeCommand();
    this.bufferRef = React.createRef<HTMLDivElement>();

    this.state = {
      text: this.bufferGap.getContents(),
      point: this.props.initPoint,
      mode: this.props.initMode,
    };
  }

  componentDidMount() {
    this.attachKeyEvents();
    document.addEventListener("click", (e) => {
      //@ts-ignore
      if (this.bufferRef.current && this.bufferRef.current.contains(e.target)) {
        this.attachKeyEvents();
      } else {
        this.detachKeyEvents();
      }
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.mode !== prevState.mode) this.initMode(this.state.mode);
  }

  componentWillUnmount() {
    this.props.save(this.state.point, true); // crude autosave
    this.detachKeyEvents();
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

  private handleSingleKeyPress = (e: KeyboardEvent, keys: string) => {
    // commands outside insert mode
    if (this.state.mode !== Mode.Insert) {
      // repeats / 0 home
      if (!isNaN(parseInt(e.key))) {
        const head = parseInt(this.commandRepeat[0]);
        if (head >= 1 || (isNaN(head) && parseInt(e.key) !== 0)) {
          this.commandRepeat = this.commandRepeat.concat(e.key);
        } else if (parseInt(e.key) === 0) {
          this.setState({
            point:
              this.state.point -
              this.distanceToNewLine(this.state.point, false),
          });
        }
        return;
      } else this.commandRepeat = "";
      const repeat = parseInt(this.commandRepeat) || 1;

      let command: string[];
      if (this.commandBuffer.push(e.key)) {
        if (commands.enders.includes(e.key)) {
          command = this.commandBuffer.flush();
        }
      } else this.commandBuffer.flush();
    }
    switch (e.key) {
      case "End":
        this.gotoEOL();
        break;
      case "Home":
        this.gotoLineStart();
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
        if (this.state.mode === Mode.Insert) this.insert(e, keys);
        else if (this.state.mode === Mode.Normal) this.normal(e, keys);
        else if (
          this.state.mode === Mode.Visual ||
          this.state.mode === Mode.Visual_Line ||
          this.state.mode === Mode.Visual_Block
        )
          this.visual(e, keys);
        this.commandRepeat = "";
        break;
    }
    this.setState({ text: this.bufferGap.getContents() });
  };

  private handleKeyCombo = (e: KeyboardEvent, keys: string) => {
    let renderBuffer = false;
    let preventCringe = true;
    switch (keys) {
      case "Control,Shift,M":
        renderBuffer = true;
        break;
      case "Shift,V":
        if (this.state.mode === Mode.Normal)
          this.setState({ mode: Mode.Visual_Line });
        break;
      case "Control,v":
        if (this.state.mode === Mode.Normal)
          this.setState({ mode: Mode.Visual_Block });
        preventCringe = false;
        break;
      default:
        break;
    }
    if (renderBuffer) {
      this.props.toggleRendered(true);
    }
    this.commandRepeat = "";
    if (preventCringe) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private insert(e: KeyboardEvent, keys?: string) {
    const prefix = keys ? keys.split(",")[0] : "";
    if (bufferIgnored.includes(prefix) && prefix !== "Shift") return;
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
    switch (e.key) {
      case "i":
        this.setState({ mode: Mode.Insert });
        break;
      case "v":
        this.setState({ mode: Mode.Visual });
        break;
      case "o":
        this.setState({ mode: Mode.Insert });
        this.bufferGap.insert("\n", this.state.point);
        this.setState({ point: this.state.point + 1 });
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
      // kys, how could the key NOT BE IN THE DAMN OBJECT IF IM ITERATING IT DUMBASS
      // WDYM "ITS IMPLICITLY ANY" ITS A GODDAMN KEY AND IT *IS* ON THE OBJECT
      for (let key in this.visMarks) {
        //@ts-ignore
        this.marks.removeMark(this.visMarks[key]);
        //@ts-ignore
        this.visMarks[key] = "";
      }
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
        bufferRef={this.bufferRef}
      />
    );
  }

  //============ commands ====================================================
  /** yank text in a region
   * @param start: location to start copying from
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

  /** execute a vim command
   * @param command: a string array of the words in the command; eg 5dj is ["5", "d", "j"]
   */
  private executeCommand = (command: string[]) => {
    let commandRepeat = "";
    command.forEach((word) => {
      if (!isNaN(parseInt(word))) {
        const head = parseInt(commandRepeat[0]);
        if (head >= 1 || (isNaN(head) && parseInt(word) !== 0)) {
          commandRepeat = commandRepeat.concat(word);
        }
      }
    });
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

  /** move the point up one line, to the same column if it can
   * @param repeat: how many lines up to go, positive int
   */
  private movePointUp(repeat = 1) {
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
    if (repeat > 1) this.movePointUp(repeat - 1);
  }

  /** move the point down one line, to the same column if it can
   * @param repeat: how many lines down to go, positive int
   */
  private movePointDown(repeat = 1) {
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
    if (repeat > 1) this.movePointDown(repeat - 1);
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
   * @return: {point, mark} the point and mark
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

  private gotoEOL = () => {
    this.setState({
      point: this.state.point - this.distanceToNewLine(this.state.point, false),
    });
  };

  private gotoLineStart = () => {
    this.setState({
      point: this.state.point - this.distanceToNewLine(this.state.point, false),
    });
  };

  private attachKeyEvents = () => {
    setTimeout(() => {
      if (this.KeventIDs.length === 0) {
        this.KeventIDs.push(
          KeyboardEvents.addListener(
            EventCategory.Buffer,
            this.handleSingleKeyPress
          ),
          KeyboardEvents.addListener(EventCategory.Mode, this.handleKeyCombo)
        );
      }
    }, 300);
  };

  private detachKeyEvents = () => {
    if (this.KeventIDs.length) {
      this.KeventIDs.forEach((k) => KeyboardEvents.removeListener(k));
      this.KeventIDs.length = 0;
    }
  };
}

export { BufferContainer, Mode };
