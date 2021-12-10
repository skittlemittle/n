import styled from "styled-components";

/** sidepanel bg */
const ToolPanel = styled.div`
  background: ${(props) => props.theme.colors.bg0_h};
  width: max-content;
`;

/** text + symbol holder for sidepanel stuff */
const TextBox = styled.div.attrs(
  (props: { color?: string; level?: number }) => ({
    color: props.color,
    level: props.level,
  })
)`
  background: transparent;
  color: ${(props) => (props.color ? props.color : props.theme.colors.fg1)};

  font-family: "Inter";
  font-style: normal;
  font-size: 14px;

  display: flex;
  align-items: center;
  padding: 0em 0.2em;
  padding-left: ${(props) => (props.level ? props.level * 15 + "px" : ".02em")};

  &:hover {
    background: ${(props) => props.theme.colors.bg1};
  }
`;

export default ToolPanel;
export { TextBox };
