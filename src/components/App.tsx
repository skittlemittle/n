import React from "react";

import BufferGap from "../lib/bufferGap";
import { EventCategory, KeyboardEvents } from "../lib/keyboardEvents";
import { BufferContainer, Mode } from "./BufferContainer";
import Rendered from "./Rendered";

interface State {
  view: boolean; // true: edit, false: rendered
  mode: Mode;
}

interface DocumentState {
  point: number;
  scroll: number;
}

class App extends React.Component<{}, State> {
  private bufferGap: BufferGap;
  private documentState: DocumentState;

  constructor(props: {}) {
    super(props);
    this.bufferGap = new BufferGap();
    this.documentState = { point: 0, scroll: 0 };
    this.state = { view: true, mode: Mode.Normal };
  }

  componentDidMount() {
    KeyboardEvents.addListener(EventCategory.Mode, this.handleKeyPress);
  }

  private handleKeyPress = (e: KeyboardEvent, keys: string) => {
    switch (keys) {
      case "Escape":
        this.setState({ mode: Mode.Normal });
        break;
      case "i":
        if (this.state.mode === Mode.Normal)
          this.setState({ mode: Mode.Insert });
        break;
      case "Control,q":
        this.setState({ view: !this.state.view });
        break;
      default:
        break;
    }
  };

  saveEditorState = (point: number) => {
    this.documentState.point = point;
  };

  saveRenderedState = (scroll: number) => {};

  render() {
    if (this.state.view) {
      return (
        <BufferContainer
          bufferGap={this.bufferGap}
          point={this.documentState.point}
          save={this.saveEditorState}
          mode={this.state.mode}
        />
      );
    } else {
      return (
        <Rendered
          text={this.bufferGap.getContents()}
          scroll={this.documentState.scroll}
        />
      );
    }
  }
}

export default App;
