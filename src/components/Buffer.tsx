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
    return (
      <Cursor
        hidden={this.state.shown}
        style={{
          top: this.props.position.row * editorSettings.lineHeight,
          left: this.props.position.column * editorSettings.fontWidth,
        }}
      ></Cursor>
    );
  }
}

interface BufferProps {
  text: string;
  point: number;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
}

class Buffer extends React.Component<BufferProps, {}> {
  render() {
    let column = this.props.point;
    let row = 0;
    let shoveCursor = true;

    return (
      <BufferPanel onPaste={this.props.onPaste}>
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

        <CursorLayer position={{ row, column }} />
      </BufferPanel>
    );
  }
}

export default Buffer;
