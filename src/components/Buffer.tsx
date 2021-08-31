import React from "react";
import styled from "styled-components";

/** Cope💅 */
const editorSettings = {
  fontSize: 16,
  fontWidth: 9.62,
  lineHeight: 19,
};

const BufferLine = styled.div`
  white-space: pre;
  height: ${editorSettings.lineHeight}px;
  font-family: monospace, monospace;
  font-style: normal;
  font-size: ${editorSettings.fontSize}px;
`;

const Cursor = styled.div`
  height: ${editorSettings.lineHeight}px;
  width: 2px;
  position: absolute;
  visibility: ${(props) => (props.hidden ? "hiddin" : "visible")};
  background: #3e3e3e;
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
    }, 300);
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
          left: 10 + this.props.position.column * editorSettings.fontWidth,
        }}
      ></Cursor>
    );
  }
}

interface BufferProps {
  text: string;
  point: number;
}

class Buffer extends React.Component<BufferProps, {}> {
  render() {
    let column = this.props.point;
    let row = 0;
    let shoveCursor = true;

    return (
      <div style={{ marginLeft: 10 }}>
        {this.props.text.split("\n").map((line, i) => {
          if (shoveCursor && column - line.length > 0) {
            column -= line.length + 1;
            row++;
          } else {
            shoveCursor = false;
          }
          return <BufferLine key={i}>{line}</BufferLine>;
        })}

        <CursorLayer position={{ row, column }} />
      </div>
    );
  }
}

export default Buffer;
