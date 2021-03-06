import { ReactNode } from "react";
import styled from "styled-components";
import nameFromPath from "../lib/nameFromPath";
import NoFile from "./NoFile";
import Cross from "./styles/crossButton";

const TabRibbon = styled.div`
  flex: 0 1 auto; //
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.bg1};
`;

const Tab = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  min-width: 40px;
  margin: 0;
  padding: 0 0.4em;
  background: ${(props) => props.theme.colors.bg1};
  color: ${(props) => props.theme.colors.fg4};
`;

const HlTab = styled(Tab)`
  background: ${(props) => props.theme.colors.bg0};
`;

const PanelBox = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.colors.bg0};
`;

interface props {
  tabs: string[];
  selectedTab: number;
  active: boolean;
  onClick: tabClick;
  children: ReactNode;
}

const TextPanel = (props: props) => (
  <PanelBox>
    <TabRibbon>
      {props.tabs.map((t, i) => {
        const title = nameFromPath(t);
        if (i === props.selectedTab) {
          return (
            <HlTab key={i} onClick={() => props.onClick(t)}>
              {title}
              <Cross onClick={() => props.onClick(t, true)} />
            </HlTab>
          );
        }
        return (
          <Tab key={i} onClick={() => props.onClick(t)}>
            {title}
          </Tab>
        );
      })}
    </TabRibbon>
    {(props.tabs.length > 0 && props.children) || <NoFile />}
  </PanelBox>
);

type tabClick = (key: string, close?: boolean) => void;

export default TextPanel;
export { PanelBox };
export type { tabClick };
