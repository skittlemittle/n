import * as React from "react";
import styled from "styled-components";

// its just a string shut up about "invalid syntax"
const Triangle = styled.div`
  width: 0;
  height: 0;
  margin: 0;
  border-top: 10px solid transparent;
  border-${(props) => props.dir}: 10px solid
    ${(props) => props.color};
  border-bottom: 10px solid transparent;
`;

const Rectangle = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0 0.5em;
  height: 20px;
  min-width: 50px;
  margin: 0;
`;

const RectRight = styled(Rectangle)`
  margin-left: -10px;
  padding-left: 1em;
`;
const RectLeft = styled(Rectangle)`
  margin-right: -10px;
  padding-right: 1em;
`;

interface props {
  children: React.ReactNode;
  dir: "left" | "right";
  textColor: string;
  color: string;
  index: number;
}

/** container to hold stuff on the status line */
const StatusSection = (props: props) => {
  if (props.dir === "left") {
    return (
      <div style={{ display: "flex", zIndex: 100 - props.index }}>
        <Triangle dir={"right"} color={props.color} />
        <RectLeft
          style={{ backgroundColor: props.color, color: props.textColor }}
        >
          {props.children}
        </RectLeft>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", zIndex: 100 - props.index }}>
        <RectRight
          style={{ backgroundColor: props.color, color: props.textColor }}
        >
          {props.children}
        </RectRight>
        <Triangle dir={"left"} color={props.color} />
      </div>
    );
  }
};

export default StatusSection;
