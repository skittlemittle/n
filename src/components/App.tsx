import React from "react";
import styled from "styled-components";

import GlobalFonts from "../assets/fonts";
import SidePanel from "./SidePanel";
import SplitManager from "./SplitManager";

const StupidBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

class App extends React.Component<{}, {}> {
  render() {
    return (
      <StupidBox>
        <GlobalFonts />
        <SidePanel />
        <SplitManager />
      </StupidBox>
    );
  }
}

export default App;
