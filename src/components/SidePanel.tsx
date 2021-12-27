import styled from "styled-components";
import { useState } from "react";

import Toolbar from "./Toolbar";
import file from "../assets/icons/file.svg";
import FileTree, { requestFileLoad } from "./FileTree";

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
  panel: React.ReactNode;
}

const SidePanelView = (props: props) => {
  return (
    <PanelBox>
      {props.bar}
      {props.panel}
    </PanelBox>
  );
};

interface panelProps {
  requestFileLoad: requestFileLoad;
}

const SidePanel = ({ requestFileLoad }: panelProps) => {
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
            { icon: file, action: () => handleToolClick(Panels.FileTree) },
          ]}
        />
      }
      panel={
        currentPanel === Panels.FileTree && (
          <FileTree
            requestFileLoad={requestFileLoad}
            initRootDirectory={"smiling_man_dimension"}
          />
        )
      }
    />
  );
};

export default SidePanel;
