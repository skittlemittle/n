import React from "react";
import styled from "styled-components";
import BufferPanel from "./styles/BufferPanel";

/** Cope💅 */
const editorSettings = {
  fontSize: 16,
  fontWidth: 9.62,
  lineHeight: 19,
};

const Cursor = styled.div`
  height: ${editorSettings.lineHeight}px;
  width: 2px;
  position: absolute;
  visibility: ${(props) => (props.hidden ? "hiddin" : "visible")};
  background: ${(props) => props.theme.colors.fg1};
  top: 0px;
  left: 0px;
`;

interface CursorState {
  shown: boolean;
}

interface CursorProps {
  position: { row: number; column: number };
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
        style={{
          top: top + this.props.position.row * editorSettings.lineHeight,
          left: left + this.props.position.column * editorSettings.fontWidth,
        }}
      ></Cursor>
    );
  }
}

interface BufferProps {
  text: string;
  point: number;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  status: (right: string[]) => React.ReactNode;
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

          <CursorLayer position={{ row, column }} parent={"buffer-panel-0"} />
        </BufferPanel>
        {this.props.status([
          `${
            Math.round((this.props.point / this.props.text.length) * 100) || 0
          }% ${row}: ${column}`,
        ])}
      </>
    );
  }
}

export default Buffer;
