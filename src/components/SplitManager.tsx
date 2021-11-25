import React from "react";
import TextPanel, { tabClick } from "./TextPanel";
import { BufferContainer, Mode } from "./BufferContainer";
import Rendered from "./Rendered";
import BufferGap from "../lib/bufferGap";
import makeMarkList, { MarkList } from "../lib/mark";
import Panel from "../lib/panel";
import { ClipBoardContext } from "./App";

interface SplitState {
  currentBuffer: string;
}

class SplitManager extends React.Component<{}, SplitState> {
  private buffers: Map<string, Buff>;
  private panelState: Panel;

  constructor(props: {}) {
    super(props);
    this.buffers = loadBuffers();
    this.panelState = new Panel();
    this.buffers.forEach((_, k) => this.panelState.addTab(k));

    this.state = { currentBuffer: this.panelState.getSelectedTab()[1] };
  }

  handleTabClick: tabClick = (index: number, close?: boolean) => {
    console.log(index, close);
  };

  saveEditState = (point: number) => {
    const b = this.buffers.get(this.state.currentBuffer);
    if (b !== undefined) b.point = point;
  };

  static contextType = ClipBoardContext;
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
            mode={Mode.Insert}
            visualMarks={buffer.visualMarkers}
            clipBoard={this.context}
            returnToNormal={() => {}}
          />
        )) || <Rendered text={buffer.bufferGap.getContents()} />}
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

export default SplitManager;
