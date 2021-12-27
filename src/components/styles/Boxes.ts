import styled from "styled-components";

type FlexDir = "row" | "column";
/**
 * @param: bg_color: key name of a color in the theme, eg: bg0
 * @param: direction: flex direction
 */
const Flex = styled.div.attrs(
  (props: { bg_color?: string; direction: FlexDir }) => ({
    bg_color: props.bg_color,
    direction: props.direction,
  })
)`
  display: flex;
  flex-direction: ${(props) => props.direction};
  background-color: ${(props) =>
    props.bg_color ? props.theme.colors[props.bg_color] : "transparent"};
`;

export { Flex };
