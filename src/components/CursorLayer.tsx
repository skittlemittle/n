import React from "react";
import Cursor from "./styles/Cursor";

interface CursorState {
  shown: boolean;
}

interface CursorProps {
  position: { row: number; column: number };
  block: boolean;
  /** id of parent buffer */
  parent: string;
  forwardedRef: React.RefObject<HTMLDivElement>;
}

/** Renders a text cursor */
class CursorLayer extends React.Component<CursorProps, CursorState> {
  private blinky: any; // not a word about this
  private fontWidth;
  private lineHeight;
  constructor(props: CursorProps) {
    super(props);
    this.state = { shown: true };

    // Cope💅
    this.lineHeight = 19;
    this.fontWidth = 9.62;

    const fontTester = document.getElementById("font-tester");
    if (isTauri() && fontTester !== null) {
      fontTester.style.fontSize = "16px";
      fontTester.style.fontFamily = "JetBrains Mono";
      this.fontWidth = fontTester.clientWidth;
    }
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
        h={this.lineHeight}
        w={this.fontWidth}
        style={{
          top: top + this.lineHeight * this.props.position.row,
          left: left + this.fontWidth * this.props.position.column,
        }}
        ref={this.props.forwardedRef}
      ></Cursor>
    );
  }
}

/** check if this is running in tauri, real sin commited here
 * @return true if tauri false otherwise
 */
function isTauri() {
  //@ts-ignore
  const browser = Array.prototype.slice
    .call(window.getComputedStyle(document.documentElement, ""))
    .join("")
    .match(/-(moz|webkit|ms)-/)[1];

  //@ts-ignore
  return !(!!window.chrome || ["moz", "ms"].includes(browser));
}

export default CursorLayer;
