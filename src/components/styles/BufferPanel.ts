import styled from "styled-components";

const BufferPanel = styled.div`
  background: ${(props) => props.theme.colors.bg0};
  color: ${(props) => props.theme.colors.fg1};

  margin: 0px;
  height: 100%;

  font-family: "JetBrains Mono", monospace;
  font-style: normal;
  font-size: 16px;

  white-space: pre;
`;

export default BufferPanel;
