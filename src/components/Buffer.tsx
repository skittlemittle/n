import React from "react";

import { Mode } from "./BufferContainer";
import StatusLine, { StatusMode } from "./StatusLine";
import BufferPanel from "./styles/BufferPanel";
import CursorLayer from "./CursorLayer";
import TextScroller from "./TextScroller";

function status(mode: Mode, left: string[], right: string[]) {
  let m: StatusMode = "normal";
  let m_name: string = m;
  if (mode === Mode.Insert) {
    m = "insert";
    m_name = m;
  } else if (mode === Mode.Visual) {
    m = "visual";
    m_name = m;
  } else if (mode === Mode.Visual_Line) {
    m = "visual";
    m_name = "v-line";
  } else if (mode === Mode.Visual_Block) {
    m = "visual";
    m_name = "v-block";
  }
  return (
    <StatusLine
      stats={{
        mode: m,
        left: [m_name.toUpperCase(), ...left],
        right: right,
      }}
    />
  );
}

const percent = (x: number, y: number) => Math.round((x / y) * 100) || 0;

interface BufferProps {
  text: string;
  point: number;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  mode: Mode;
}

class Buffer extends React.Component<BufferProps, {}> {
  private cursorRef;

  constructor(props: BufferProps) {
    super(props);
    this.cursorRef = React.createRef<HTMLDivElement>();
  }

  render() {
    let column = this.props.point;
    let row = 0;
    let shoveCursor = true;

    return (
      <>
        <TextScroller target={this.cursorRef}>
          <BufferPanel id={"buffer-panel-0"} onPaste={this.props.onPaste}>
            {this.props.text.split("\n").map((line, i) => {
              if (shoveCursor && column - line.length > 0) {
                column -= line.length + 1;
                row++;
              } else {
                shoveCursor = false;
              }
              return <div key={i}>{line}</div>;
            })}

            <CursorLayer
              position={{ row, column }}
              parent={"buffer-panel-0"}
              block={this.props.mode !== Mode.Insert}
              forwardedRef={this.cursorRef}
            />
          </BufferPanel>
        </TextScroller>
        {status(
          this.props.mode,
          ["owo"],
          [
            `${percent(
              this.props.point,
              this.props.text.length
            )}% ${row}: ${column}`,
          ]
        )}
      </>
    );
  }
}

export default Buffer;
