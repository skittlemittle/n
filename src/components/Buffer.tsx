import React from "react";
import styled from "styled-components";

const BufferLine = styled.div`
  white-space: pre;
  height: 19px;
`;

const Bar = styled.div`
  height: 19px;
  width: 2px;
  position: absolute;
  visibility: ${(props) => (props.hidden ? "hiddin" : "visible")};
  background: red;
  top: 0px;
  left: 0px;
`;

interface CursorState {
  shown: boolean;
}

interface CursorProps {
  position: { row: number; column: number };
}

/** Draws and positions the cursor */
class CursorLayer extends React.Component<CursorProps, CursorState> {
  constructor(props: CursorProps) {
    super(props);
    this.state = { shown: true };
  }

  componentDidMount() {
    setInterval(() => {
      const s = this.state.shown;
      this.setState({ shown: !s });
    }, 300);
  }

  render() {
    return (
      <Bar
        hidden={this.state.shown}
        style={{
          top: this.props.position.row * 19, //TODO: MAGIC NUMBERS REEEEEEEEEEEEEEEEE
          left: 10 + this.props.position.column * 8,
        }}
      ></Bar>
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

    return (
      <div style={{ marginLeft: 10 }}>
        {this.props.text.split("\n").map((line, i) => {
          if (column - line.length > 0) {
            column -= line.length + 1;
            row++;
          }
          return <BufferLine key={i}>{line}</BufferLine>;
        })}

        <CursorLayer position={{ row, column }} />
      </div>
    );
  }
}

export default Buffer;
