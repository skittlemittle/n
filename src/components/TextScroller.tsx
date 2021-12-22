import { ReactNode, RefObject, useEffect, useRef } from "react";
import { ScrollBox } from "./styles/BufferPanel";

interface props {
  /** child div to keep in frame */
  target: RefObject<HTMLDivElement>;
  children: ReactNode;
}

/** scrolling container */
const TextScroller = (props: props) => {
  const scrollboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.target.current && scrollboxRef.current) {
      const offset = props.target.current.getBoundingClientRect().top;
      const h = props.target.current.clientHeight;
      const scroll = scrollboxRef.current.scrollTop;
      if (offset > scroll || offset < 0) {
        scrollboxRef.current.scrollTo({
          top: offset + h,
          behavior: "smooth",
        });
      }
      console.log(`o ${offset}    s ${scroll}`);
    }
  });

  return <ScrollBox ref={scrollboxRef}>{props.children}</ScrollBox>;
};

export default TextScroller;
