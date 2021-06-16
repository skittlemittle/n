import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Buffer from "./Buffer";
import reportWebVitals from "./reportWebVitals";
import BufferGap from "./bufferGap";

interface BufferState {
  text: string;
}

class BufferContainer extends React.Component<{}, BufferState> {
  private bufferGap: BufferGap;

  constructor(props: {}) {
    super(props);

    this.bufferGap = new BufferGap();
    this.state = { text: "" };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  private handleKeyPress = (key: KeyboardEvent) => {
    switch (key.key) {
      case "Enter":
        this.bufferGap.insert("\n", 0);
        break;
      case "Delete":
        this.bufferGap.delete(true, 1, 0);
        break;
      default:
        this.bufferGap.insert(key.key, 0);
        break;
    }
    this.setState({ text: this.bufferGap.getContents() });
  };

  render() {
    return <Buffer text={this.state.text} />;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <BufferContainer />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
