import styled from "styled-components";

const Cursor = styled.div.attrs(
  (props: { block: boolean; w: number; h: number; dissapear: boolean }) => ({
    block: props.block,
    w: props.w,
    h: props.h,
    dissapear: props.dissapear,
  })
)`
  height: ${(props) => props.h}px;
  width: ${(props) => (props.block ? props.w : 2)}px;
  position: absolute;
  visibility: ${(props) => (props.dissapear ? "hidden" : "visible")};
  background: ${(props) =>
    props.block ? props.theme.colors.orange_l : props.theme.colors.fg1};
  opacity: ${(props) => (props.block ? 0.45 : 1)};
  top: 0px;
  left: 0px;
  z-index: 2;
`;

export default Cursor;
