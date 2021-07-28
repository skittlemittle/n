import React from "react";

import Buffer from "./Buffer";
import BufferGap from "../lib/bufferGap";
import { KeyboardEvents, EventCategory } from "../lib/keyboardEvents";

interface BufferState {
  text: string;
  point: number;
}

class BufferContainer extends React.Component<{}, BufferState> {
  private bufferGap: BufferGap;

  constructor(props: {}) {
    super(props);
    this.bufferGap = new BufferGap();
    this.state = { text: "", point: 0 };
  }

  componentDidMount() {
    KeyboardEvents.addListener(EventCategory.Buffer, this.handleKeyPress);
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
      if (seek + step === 0) break;
      if (seek + step === this.state.text.length) {
        distance++;
        break;
      }
      if (this.state.text[seek + step] === "\n") break;
      distance++;
      seek += step;
    }
    return distance;
  }

  /** arrowup */
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

  /** arrowdown */
  private movePointDown() {
    let p = this.state.point;
    const d1 = this.distanceToNewLine(p, false);
    const d2 = this.distanceToNewLine(p, true);
    p += d2 + 2 + d1;
    if (p < this.state.text.length) this.setState({ point: p });
  }

  private handleKeyPress = (key: KeyboardEvent) => {
    switch (key.key) {
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
        this.bufferGap.insert("    ", this.state.point);
        this.setState({ point: this.state.point + 4 });
        break;
      case "End":
        this.setState({
          point:
            this.state.point + this.distanceToNewLine(this.state.point, true),
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
        this.bufferGap.insert(key.key, this.state.point);
        this.setState({ point: this.state.point + 1 });
        break;
    }
    this.setState({ text: this.bufferGap.getContents() });
  };

  render() {
    return <Buffer text={this.state.text} point={this.state.point} />;
  }
}

export default BufferContainer;
