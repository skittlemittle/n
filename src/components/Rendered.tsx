/*
 * gaming
 *
 * epic rendered view
 */

import React from "react";

interface Props {
  text: string;
  scroll: number;
}

class Rendered extends React.Component<Props, {}> {
  render() {
    return <h1>{this.props.text}</h1>;
  }
}

export default Rendered;
