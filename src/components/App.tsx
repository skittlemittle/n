import React from "react";

import ClipBoard from "../lib/clipBoard";
import GlobalFonts from "../assets/fonts";
import SplitManager from "./SplitManager";

export var ClipBoardContext = React.createContext({}); // possibly stupid default

class App extends React.Component<{}, {}> {
  /** the currently active buffer, the one you can type in */

  /*
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
*/
  render() {
    return (
      <ClipBoardContext.Provider value={new ClipBoard()}>
        <GlobalFonts />
        <SplitManager />
      </ClipBoardContext.Provider>
    );
  }
}

export default App;
