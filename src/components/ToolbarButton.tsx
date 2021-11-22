import styled from "styled-components";

const Tbutton = styled.button`
  height: 40px;
  width: 40px;
  background: transparent;
  border: none;
  background-image: url(${(props) => props.resource});
  background-size: cover;
  background-repeat: no-repeat;
  margin: none;
  padding: 0px;
`;

interface props {
  iconUrl: string;
  action: () => void;
}

/** image button */
const ToolbarButton = (props: props) => (
  <Tbutton onClick={props.action} resource={props.iconUrl} />
);

export default ToolbarButton;
