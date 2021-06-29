import React from "react";

import Buffer from "./Buffer";
import BufferGap from "../bufferGap";
import { KeyboardEvents, EventCategory } from "../keyboardEvents";

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
    return this.state.point === 0 ? 0 : this.state.point - 1;
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
      case "ArrowLeft":
        this.setState({ point: this.decrementPoint(1) });
        break;
      case "ArrowRight":
        this.setState({ point: this.state.point + 1 });
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
