import * as React from "react";
import styled, { ThemeContext } from "styled-components";
import { STATUSLINE_COLORS } from "../themeConstants";
import StatusSection from "./StatusSection";

const Line = styled.div.attrs((props: { bg_color: string }) => ({
  bg_color: props.bg_color,
}))`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors[props.bg_color]};
`;

const Right = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: row-reverse;
`;

function MakeSection(
  content: string,
  index: number,
  colors: sectionColors,
  facing: "left" | "right"
) {
  const themeContext = React.useContext(ThemeContext);
  return (
    <StatusSection
      dir={facing}
      textColor={themeContext.colors[colors.fg]}
      color={themeContext.colors[colors.bg]}
      index={index}
      key={index}
    >
      {content}
    </StatusSection>
  );
}

interface props {
  stats: DocStats;
}

/** statusline */
const StatusLine = ({ stats }: props) => {
  const colors = STATUSLINE_COLORS[stats.mode].sections;
  const bg = STATUSLINE_COLORS[stats.mode].background;

  return (
    <Line bg_color={bg}>
      {stats.left.map((stat, i) => MakeSection(stat, i, colors[i], "right"))}
      <Right>
        {stats.right.map((stat, i) => MakeSection(stat, i, colors[i], "left"))}
      </Right>
    </Line>
  );
};

export default StatusLine;

/** left / right: string arrays, each string is one section */
interface DocStats {
  /** all lowercase, valid mode name */
  mode: StatusMode;
  left: string[];
  right: string[];
}

type StatusMode = "insert" | "visual" | "rendered" | "normal";

interface sectionColors {
  bg: string;
  fg: string;
}
