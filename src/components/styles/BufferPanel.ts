import styled from "styled-components";

const BufferPanel = styled.div`
  background: ${(props) => props.theme.colors.bg0};
  color: ${(props) => props.theme.colors.fg1};

  margin: 0px;
  flex: 1 1 auto;
  height: 100%;

  font-family: "JetBrains Mono", monospace;
  font-style: normal;
  font-size: 16px;

  white-space: pre;
`;

/** put stuff that scrolls in this */
const ScrollBox = styled.div`
  margin: 0px;
  flex: 1 1 auto;
  overflow-y: scroll;
  scroll-padding-top: 1em;
`;

export default BufferPanel;
export { ScrollBox };
