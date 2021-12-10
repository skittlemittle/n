import styled from "styled-components";
import { useState } from "react";

import Toolbar from "./Toolbar";
import face from "../assets/icons/face.svg";
import FileTree from "./FileTree";

const PanelBox = styled.div`
  float: left;
  display: flex;
  flex-direction: row;
`;

enum Panels {
  None,
  FileTree,
  Settings,
}

interface props {
  /** toolbars and stuff */
  bar: React.ReactNode;
  /** the thing the toolbar pulls up, filetree etc */
  panel: Panels;
}

const SidePanelView = (props: props) => {
  return (
    <PanelBox>
      {props.bar}
      {props.panel === Panels.FileTree && <FileTree />}
    </PanelBox>
  );
};

const SidePanel = () => {
  const [currentPanel, changePanel] = useState(Panels.None);

  const handleToolClick = (clicked: Panels) => {
    if (currentPanel === clicked) changePanel(Panels.None);
    else changePanel(clicked);
  };

  return (
    <SidePanelView
      bar={
        <Toolbar
          dir={"right"}
          buttons={[
            { icon: face, action: () => handleToolClick(Panels.FileTree) },
          ]}
        />
      }
      panel={currentPanel}
    />
  );
};

export default SidePanel;
