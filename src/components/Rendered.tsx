/*
 * Rendered buffer view
 */

import React from "react";
import marked from "marked";
import DOMPurify from "dompurify";
import renderLaTeXInElement from "katex/dist/contrib/auto-render";

import "./stolen/katex.min.css";
import RenderedPanel from "./styles/RenderedPanel";

/** override markdown outputs */
const renderer = {
  code(code: string, info: string, escaped: boolean) {
    return `
      <div class="code-block">
        <pre>
          <code class=language-${info}>\n${code}</code>
        </pre>
      </div>
    `;
  },
};

marked.use({ renderer });

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
      <RenderedPanel
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(this.props.text)),
        }}
      ></RenderedPanel>
    );
  }
}

export default Rendered;
