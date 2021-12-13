import React from "react";
import styled from "styled-components";

import GlobalFonts from "../assets/fonts";
import { requestFileLoad } from "./FileTree";
import SidePanel from "./SidePanel";
import SplitManager from "./SplitManager";

const StupidBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

interface state {
  fileToLoad: string | null;
}

class App extends React.Component<{}, state> {
  constructor(props: {}) {
    super(props);
    this.state = { fileToLoad: null };
  }

  private loadFile: requestFileLoad = (path: string) => {
    if (path !== this.state.fileToLoad) this.setState({ fileToLoad: path });
  };

  render() {
    return (
      <StupidBox>
        <GlobalFonts />
        <SidePanel requestFileLoad={this.loadFile} />
        <SplitManager fileToLoad={this.state.fileToLoad} />
      </StupidBox>
    );
  }
}

export default App;

//TODO:
// - context for file change function, its drilled through like 5 layers rn
