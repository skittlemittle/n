import React from "react";
import styled from "styled-components";

// babaooeey https://stackoverflow.com/a/47196589
const CrossButton = styled.button`
  vertical-align: center;
  position: relative;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.fg4};
  height: 12px;
  min-width: 12px;
  margin: 0px;

  &:after,
  &:before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    height: 10px;
    width: 2px;
    background-color: currentColor;
  }

  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const Holder = styled.div`
  padding: 0 0.2em;
  padding-top: 0.2em;
  margin: 0px;
  display: flex;
  align-items: center;
`;

interface props {
  onClick: () => void;
}

const Cross = (props: props) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    props.onClick();
  };

  return (
    <Holder>
      <CrossButton onClick={handleClick} />
    </Holder>
  );
};

export default Cross;
