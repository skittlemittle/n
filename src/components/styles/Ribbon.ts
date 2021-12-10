import styled from "styled-components";

/** @param dir: the side of the ribbon to place the divider line */
const Ribbon = styled.div`
  width: 40px;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: ${(props) => props.theme.colors.bg0_h};
  border-${(props) => props.dir}: 1px solid ${(props) =>
  props.theme.colors.bg2};
`;

export default Ribbon;
