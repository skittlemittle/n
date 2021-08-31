import React from "react";

import BufferGap from "../lib/bufferGap";
import { EventCategory, KeyboardEvents } from "../lib/keyboardEvents";
import BufferContainer from "./BufferContainer";
import Rendered from "./Rendered";

interface State {
  view: boolean; // true: edit, false: rendered
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
    this.state = { view: true };
  }

  componentDidMount() {
    KeyboardEvents.addListener(EventCategory.Control, this.handleKeyPress);
  }

  private handleKeyPress = (key: KeyboardEvent) => {
    switch (key.key) {
      case "Escape":
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
