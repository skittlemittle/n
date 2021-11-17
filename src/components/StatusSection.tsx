import * as React from "react";
import styled from "styled-components";

// its just a string shut up about "invalid syntax"
const Triangle = styled.div`
  width: 0;
  height: 0;
  margin: 0;
  border-top: 10px solid transparent;
  border-${(props) => props.dir}: 14px solid
    ${(props) => props.theme.colors.fg2};
  border-bottom: 10px solid transparent;
`;

const Rectangle = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  color: ${(props) => props.theme.colors.bg1};
  display: flex;
  align-items: center;
  padding: 0 0.75em;
  height: 20px;
  min-width: 50px;
  margin: 0;
  background-color: ${(props) => props.theme.colors.fg2};
`;

interface props {
  children: React.ReactNode;
  dir: "left" | "right";
}
/** container to hold stuff on the status line */
const StatusSection = (props: props) => {
  if (props.dir === "left") {
    return (
      <div style={{ display: "flex" }}>
        <Triangle dir={"right"}></Triangle>
        <Rectangle>{props.children}</Rectangle>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex" }}>
        <Rectangle>{props.children}</Rectangle>
        <Triangle dir={"left"}></Triangle>
      </div>
    );
  }
};

export default StatusSection;
