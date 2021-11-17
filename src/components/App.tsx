import React from "react";

import BufferGap from "../lib/bufferGap";
import { EventCategory, KeyboardEvents } from "../lib/keyboardEvents";
import makeMarkList from "../lib/mark";
import type { MarkList } from "../lib/mark";
import { BufferContainer, Mode } from "./BufferContainer";
import Rendered from "./Rendered";
import ClipBoard from "../lib/clipBoard";
import GlobalFonts from "../assets/fonts";

interface State {
  view: boolean; // true: edit, false: rendered
  mode: Mode;
}

interface DocumentState {
  point: number;
  scroll: number;
  visualMarkers: MarkList;
}

class App extends React.Component<{}, State> {
  private bufferGap: BufferGap;
  private clipBoard: ClipBoard;
  private documentState: DocumentState;
  private KeventID: number;

  constructor(props: {}) {
    super(props);
    // === document data; to be extracted ===
    this.bufferGap = new BufferGap();
    this.clipBoard = new ClipBoard();
    this.documentState = {
      point: 0,
      scroll: 0,
      visualMarkers: makeMarkList(),
    };
    // =====================================
    this.state = { view: true, mode: Mode.Normal };
    this.KeventID = -1;
  }

  componentDidMount() {
    this.KeventID = KeyboardEvents.addListener(
      EventCategory.Mode,
      this.handleKeyPress
    );
  }

  componentWillUnmount() {
    KeyboardEvents.removeListener(this.KeventID);
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
      case "v":
        if (this.state.mode === Mode.Normal)
          this.setState({ mode: Mode.Visual });
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

  returnToNormal = () => {
    this.setState({ mode: Mode.Normal });
  };

  render() {
    if (this.state.view) {
      return (
        <>
          <GlobalFonts />
          <BufferContainer
            bufferGap={this.bufferGap}
            initPoint={this.documentState.point}
            save={this.saveEditorState}
            mode={this.state.mode}
            visualMarks={this.documentState.visualMarkers}
            clipBoard={this.clipBoard}
            returnToNormal={this.returnToNormal}
          />
        </>
      );
    } else {
      return (
        <>
          <GlobalFonts />
          <Rendered
            text={this.bufferGap.getContents()}
            scroll={this.documentState.scroll}
          />
        </>
      );
    }
  }
}

export default App;
