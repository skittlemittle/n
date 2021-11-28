import React from "react";

import GlobalFonts from "../assets/fonts";
import SplitManager from "./SplitManager";

class App extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <GlobalFonts />
        <SplitManager />
      </>
    );
  }
}

export default App;
