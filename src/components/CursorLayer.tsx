import React from "react";
import Cursor from "./styles/Cursor";

interface CursorState {
  shown: boolean;
}

interface CursorProps {
  position: { row: number; column: number };
  size: { height: number; width: number };
  block: boolean;
  /** id of parent buffer */
  parent: string;
  forwardedRef: React.RefObject<HTMLDivElement>;
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
        dissapear={this.state.shown}
        block={this.props.block}
        h={this.props.size.height}
        w={this.props.size.width}
        style={{
          top: top + this.props.position.row,
          left: left + this.props.position.column,
        }}
        ref={this.props.forwardedRef}
      ></Cursor>
    );
  }
}

export default CursorLayer;
