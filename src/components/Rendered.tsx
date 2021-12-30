/*
 * Rendered buffer view
 */

import { useEffect } from "react";
import marked from "marked";
import DOMPurify from "dompurify";
import renderLaTeXInElement from "katex/dist/contrib/auto-render";

import "../stolen/katex/katex.min.css";
import RenderedPanel from "./styles/RenderedPanel";
import StatusLine from "./StatusLine";
import { toggleRendred } from "./SplitManager";
import { EventCategory, KeyboardEvents } from "../lib/keyboardEvents";

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
  toggleRendered: toggleRendred;
}

const Rendered = (props: Props) => {
  useEffect(() => {
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
    const Kid = KeyboardEvents.addListener(
      EventCategory.Mode,
      (e: KeyboardEvent, keys: string) => {
        switch (keys) {
          case "Control,Shift,M":
            e.preventDefault();
            e.stopImmediatePropagation();
            props.toggleRendered(false);
            break;
          default:
            break;
        }
      }
    );
    return () => KeyboardEvents.removeListener(Kid);
  });

  // 💅💅💅💅💅💅💅💅💅💅
  return (
    <>
      <RenderedPanel
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(props.text)),
        }}
      />
      <StatusLine
        stats={{
          mode: "rendered",
          left: ["RENDERED"],
          right: [],
        }}
      />
    </>
  );
};

export default Rendered;
