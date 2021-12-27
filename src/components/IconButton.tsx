import styled from "styled-components";

const ImgButton = styled.button.attrs((props: { h?: number; w?: number }) => ({
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

  &:hover {
    background: ${(props) => props.theme.colors.bg1};
    background-image: url(${(props) => props.resource});
    background-size: cover;
    background-repeat: no-repeat;
  }

  &:active {
    background: ${(props) => props.theme.colors.bg2};
    background-image: url(${(props) => props.resource});
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

interface props {
  iconUrl: string;
  action: () => void;
  /** width, height */
  size?: [number, number];
}

/** image button with transparent background */
const IconButton = ({ iconUrl, action, size }: props) => {
  if (size && size.length === 2)
    return (
      <ImgButton onClick={action} resource={iconUrl} w={size[0]} h={size[1]} />
    );

  return <ImgButton onClick={action} resource={iconUrl} />;
};

export default IconButton;
