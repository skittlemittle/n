/*
 * Rendered buffer view
 */

import React from "react";

import marked from "marked";
import DOMPurify from "dompurify";
import renderLaTeXInElement from "katex/dist/contrib/auto-render";
import "./stolen/katex.min.css";

interface Props {
  text: string;
  scroll: number;
}

class Rendered extends React.Component<Props, {}> {
  componentDidMount() {
    // I am completely sane, trust me
    renderLaTeXInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }

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
