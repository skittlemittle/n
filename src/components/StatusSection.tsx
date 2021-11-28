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
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0 0.5em;
  height: 20px;
  margin: 0;
`;

interface secProps {
  index: number;
  bg_color: string;
  text_color: string;
  text_weight: number;
  dir: "left" | "right";
}

// im properly proud of this one
const Rect = styled(Rectangle).attrs((props: secProps) => ({
  index: props.index,
  bg_color: props.bg_color,
  text_color: props.text_color,
  dir: props.dir,
}))`
${(props) =>
  props.dir === "right"
    ? "margin-right:" + (props.index !== 0 ? "-10px" : "0px") + ";"
    : "margin-left: -10px;"};
  padding-${(props) => props.dir}: 1em;
  background-color: ${(props) => props.bg_color};
  color: ${(props) => props.text_color};
  font-weight: ${(props) => (props.index === 0 ? "600" : "100")};
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
        <Rect
          index={props.index}
          bg_color={props.color}
          text_color={props.textColor}
          dir={"right"}
        >
          {props.children}
        </Rect>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", zIndex: 100 - props.index }}>
        <Rect
          index={props.index}
          bg_color={props.color}
          text_color={props.textColor}
          dir={"left"}
        >
          {props.children}
        </Rect>
        <Triangle dir={"left"} color={props.color} />
      </div>
    );
  }
};

export default StatusSection;
