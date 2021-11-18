import * as React from "react";
import styled from "styled-components";

const Line = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.bg1};
`;

const Right = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: row-reverse;
`;

interface props {
  left: React.ReactNode;
  right: React.ReactNode;
}

/** statusline */
const StatusLine = (props: props) => (
  <Line>
    {props.left}
    <Right>{props.right}</Right>
  </Line>
);

export default StatusLine;
