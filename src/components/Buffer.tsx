import React from "react";

import { Mode } from "./BufferContainer";
import StatusLine, { StatusMode } from "./StatusLine";
import BufferPanel, { ScrollBox } from "./styles/BufferPanel";
import CursorLayer from "./CursorLayer";

/** Cope💅 */
const editorSettings = {
  fontSize: 16,
  fontWidth: 9.62,
  lineHeight: 19,
};

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

interface BufferProps {
  text: string;
  point: number;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  mode: Mode;
}

class Buffer extends React.Component<BufferProps, {}> {
  render() {
    let column = this.props.point;
    let row = 0;
    let shoveCursor = true;

    return (
      <>
        <ScrollBox>
          <BufferPanel id={"buffer-panel-0"} onPaste={this.props.onPaste}>
            {this.props.text.split("\n").map((line, i) => {
              if (shoveCursor && column - line.length > 0) {
                column -= line.length + 1;
                row++;
              } else {
                shoveCursor = false;
              }
              return (
                <div key={i} style={{ height: editorSettings.lineHeight }}>
                  {line}
                </div>
              );
            })}

            <CursorLayer
              position={{
                row: row * editorSettings.lineHeight,
                column: column * editorSettings.fontWidth,
              }}
              size={{
                height: editorSettings.lineHeight,
                width: editorSettings.fontWidth,
              }}
              parent={"buffer-panel-0"}
              block={this.props.mode !== Mode.Insert}
            />
          </BufferPanel>
        </ScrollBox>

        {status(
          this.props.mode,
          ["owo"],
          [
            `${
              Math.round((this.props.point / this.props.text.length) * 100) || 0
            }% ${row}: ${column}`,
          ]
        )}
      </>
    );
  }
}

export default Buffer;
