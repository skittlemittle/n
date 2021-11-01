/*
 * Rendered buffer view
 */

import React from "react";
import marked from "marked";
import DOMPurify from "dompurify";

interface Props {
  text: string;
  scroll: number;
}

class Rendered extends React.Component<Props, {}> {
  render() {
    // 💅💅💅💅💅💅💅💅💅💅
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(this.props.text)),
        }}
      ></div>
    );
  }
}

export default Rendered;
