import styled from "styled-components";

const MenuBox = styled.div.attrs((props: { top: number; left: number }) => ({
  top: props.top,
  left: props.left,
}))`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  min-width: 80px;
  padding: 0.25em;
  background: ${(props) => props.theme.colors.bg0};
  border: 1px solid ${(props) => props.theme.colors.bg4};
  border-radius: 2px;
  box-shadow: 1px 1px 6px 1px rgba(124, 111, 100, 0.21);
`;

const MenuItem = styled.div`
  color: ${(props) => props.theme.colors.fg1};
  font-family: "Inter";
  font-style: normal;
  font-size: 14px;
  padding: 0.35em;

  &:hover {
    background: ${(props) => props.theme.colors.bg0_h};
  }
`;

interface Item {
  text: string;
  action: () => void;
}

interface Props {
  items: Item[];
  top: number;
  left: number;
}

const Menu = (props: Props) => {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    action();
  };

  return (
    <MenuBox top={props.top} left={props.left}>
      {props.items.map((it, i) => (
        <MenuItem
          key={i}
          onClick={(e: React.MouseEvent) => handleClick(e, it.action)}
        >
          {it.text}
        </MenuItem>
      ))}
    </MenuBox>
  );
};

export default Menu;
