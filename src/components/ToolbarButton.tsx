import styled from "styled-components";

const Tbutton = styled.button.attrs((props: { h?: number; w?: number }) => ({
  h: props.h,
  w: props.w,
}))`
  height: ${(props) => props.h || "40"}px;
  width: ${(props) => props.w || "40"}px;
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
  /** width, height */
  size?: [number, number];
}

/** image button */
const ToolbarButton = ({ iconUrl, action, size }: props) => {
  if (size && size.length === 2)
    return (
      <Tbutton onClick={action} resource={iconUrl} w={size[0]} h={size[1]} />
    );

  return <Tbutton onClick={action} resource={iconUrl} />;
};

export default ToolbarButton;
