import React from "react";

interface BufferProps {
  text: string;
}

class Buffer extends React.Component<BufferProps, {}> {
  render() {
    return (
      <div>
        {this.props.text.split("\n").map((line) => (
          <div>{`${line}`}</div>
        ))}
      </div>
    );
  }
}

export default Buffer;
