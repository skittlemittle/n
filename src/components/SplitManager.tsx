import React from "react";
import TextPanel, { tabClick } from "./TextPanel";
import { BufferContainer, Mode } from "./BufferContainer";
import Rendered from "./Rendered";
import BufferGap from "../lib/bufferGap";
import makeMarkList, { MarkList } from "../lib/mark";
import Panel from "../lib/panel";
import AppClipBoard from "../lib/clipBoard";

interface SplitState {
  /** name of the active buffer */
  currentBuffer: string;
  /** view of the current buffer */
  view: BufferView;
}

class SplitManager extends React.Component<{}, SplitState> {
  private buffers: Map<string, Buff>;
  private panelState: Panel;
  /** vim mode (app level), mode is persisted across buffers */
  private lastMode: Mode;
  private clipBoard: AppClipBoard;

  constructor(props: {}) {
    super(props);
    this.buffers = loadBuffers();
    this.panelState = new Panel();
    this.buffers.forEach((_, k) => this.panelState.addTab(k));
    this.lastMode = Mode.Normal;
    this.clipBoard = new AppClipBoard();

    const cBuff = this.panelState.getSelectedTab()[1];
    this.state = {
      currentBuffer: cBuff,
      view: this.buffers.get(cBuff)?.view || "edit",
    };
  }

  handleTabClick: tabClick = (index: number, close?: boolean) => {
    console.log(index, close);
  };

  saveEditState = (point: number) => {
    const b = this.buffers.get(this.state.currentBuffer);
    if (b !== undefined) b.point = point;
  };

  saveMode = (m: Mode) => {
    this.lastMode = m;
  };

  /** set the view and trigger a rerender */
  toggleRendered = (t: boolean) => {
    const b = this.buffers.get(this.state.currentBuffer);
    if (b !== undefined) {
      b.view = t ? "rendered" : "edit";
      this.setState({ view: b.view });
    }
  };

  render() {
    let buffer = this.buffers.get(this.state.currentBuffer);
    buffer = buffer === undefined ? makeEmptyBuffer() : buffer;

    return (
      <TextPanel
        tabs={this.panelState.getTabs()}
        selectedTab={this.panelState.getSelectedTab()[0]}
        active={true}
        onClick={this.handleTabClick}
      >
        {(buffer.view === "edit" && (
          <BufferContainer
            bufferGap={buffer.bufferGap}
            initPoint={buffer.point}
            save={this.saveEditState}
            initMode={this.lastMode}
            clipBoard={this.clipBoard}
            visualMarks={buffer.visualMarkers}
            saveMode={this.saveMode}
            toggleRendered={this.toggleRendered}
          />
        )) || (
          <Rendered
            text={buffer.bufferGap.getContents()}
            toggleRendered={this.toggleRendered}
          />
        )}
      </TextPanel>
    );
  }
}

/** state information of a buffer */
interface Buff {
  point: number;
  visualMarkers: MarkList;
  bufferGap: BufferGap;
  view: BufferView;
}

type BufferView = "edit" | "rendered";

function makeEmptyBuffer(): Buff {
  return {
    point: 0,
    visualMarkers: makeMarkList(),
    bufferGap: new BufferGap(),
    view: "edit",
  };
}

// TODO: stub
function loadBuffers() {
  const buffers = new Map<string, Buff>();
  buffers.set("owo", makeEmptyBuffer());
  return buffers;
}

type toggleRendred = (t: boolean) => void;
export default SplitManager;
export type { toggleRendred };
