import React from "react";
import styled from "styled-components";
import { Mode } from "./BufferContainer";
import StatusLine, { StatusMode } from "./StatusLine";
import BufferPanel from "./styles/BufferPanel";

/** Cope💅 */
const editorSettings = {
  fontSize: 16,
  fontWidth: 9.62,
  lineHeight: 19,
};

const Cursor = styled.div.attrs((props: { block: boolean }) => ({
  block: props.block,
}))`
  height: ${editorSettings.lineHeight}px;
  width: ${(props) => (props.block ? editorSettings.fontWidth + "px" : "2px")};
  position: absolute;
  visibility: ${(props) => (props.hidden ? "hiddin" : "visible")};
  background: ${(props) => props.theme.colors.fg1};
  top: 0px;
  left: 0px;
  z-index: 1;
`;

interface CursorState {
  shown: boolean;
}

interface CursorProps {
  position: { row: number; column: number };
  block: boolean;
  /** id of parent buffer */
  parent: string;
}

/** Renders a text cursor */
class CursorLayer extends React.Component<CursorProps, CursorState> {
  private blinky: any; // not a word about this
  constructor(props: CursorProps) {
    super(props);
    this.state = { shown: true };
  }

  componentDidMount() {
    this.blinky = setInterval(() => {
      const s = this.state.shown;
      this.setState({ shown: !s });
    }, 400);
  }

  componentWillUnmount() {
    clearInterval(this.blinky);
  }

  render() {
    const offsets = document
      .getElementById(this.props.parent)
      ?.getBoundingClientRect();
    let top = 0;
    let left = 0;
    if (offsets) {
      top = offsets.top;
      left = offsets.left;
    }
    return (
      <Cursor
        hidden={this.state.shown}
        block={this.props.block}
        style={{
          top: top + this.props.position.row * editorSettings.lineHeight,
          left: left + this.props.position.column * editorSettings.fontWidth,
        }}
      ></Cursor>
    );
  }
}

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
            position={{ row, column }}
            parent={"buffer-panel-0"}
            block={this.props.mode !== Mode.Insert}
          />
        </BufferPanel>
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
