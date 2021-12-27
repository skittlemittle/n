import styled from "styled-components";

const TextButton = styled.div`
  background: transparent;
  border: none;
  margin: 0px;
  padding: 0.1em 0.25em;
  color: ${(props) => props.theme.colors.aqua};
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  user-select: none;

  &:hover {
    background: ${(props) => props.theme.colors.bg1};
  }

  &:active {
    background: ${(props) => props.theme.colors.bg2};
  }
`;

export default TextButton;
