import React from "react";
import TextPanel, { tabClick } from "./TextPanel";
import { BufferContainer, Mode } from "./BufferContainer";
import Rendered from "./Rendered";
import BufferGap from "../lib/bufferGap";
import makeMarkList, { MarkList } from "../lib/mark";
import Panel from "../lib/panel";
import AppClipBoard from "../lib/clipBoard";
import { loadFile } from "../fileOperations";

interface SplitState {
  /** name of the active buffer */
  currentBuffer: Buff;
  /** view of the current buffer */
  view: BufferView;
}

interface SplitProps {
  /** path to the file to be loaded */
  fileToLoad: string | null;
}

class SplitManager extends React.Component<SplitProps, SplitState> {
  private buffers: Map<string, Buff>;
  private panelState: Panel;
  /** vim mode (app level), mode is persisted across buffers */
  private lastMode: Mode;
  private clipBoard: AppClipBoard;

  constructor(props: SplitProps) {
    super(props);
    this.buffers = loadBuffers();
    this.panelState = new Panel();
    this.buffers.forEach((_, k) => this.panelState.addTab(k));
    this.lastMode = Mode.Normal;
    this.clipBoard = new AppClipBoard();

    const cBuff = this.panelState.getSelectedTab()[1];
    this.state = {
      currentBuffer: this.buffers.get(cBuff) || makeEmptyBuffer(),
      view: this.buffers.get(cBuff)?.view || "rendered",
    };
  }

  componentDidUpdate(prevProps: SplitProps) {
    const path = this.props.fileToLoad;

    if (path && path !== prevProps.fileToLoad) {
      if (!this.buffers.has(path)) {
        makeBufferFromFile(path)
          .then((file) => {
            if (file !== null) {
              this.buffers.set(path, file);
              this.panelState.addTab(path);
              const cBuff = this.buffers.get(
                this.panelState.getSelectedTab()[1]
              );
              this.setState({
                currentBuffer: cBuff || this.state.currentBuffer,
                view: cBuff?.view === "edit" ? "rendered" : "edit", // dirty hack to get it to refresh
              });
            }
          })
          .catch((e) => console.log(`FileError  ${e}`));
      } else {
        this.panelState.selectTab(path);
        this.setState({
          currentBuffer: this.buffers.get(path) || this.state.currentBuffer,
        });
      }
    }
  }

  private handleTabClick: tabClick = (path: string, close?: boolean) => {
    let selected = path;
    if (close) {
      this.buffers.delete(path);
      this.panelState.closeTab(path);
      selected = this.panelState.getSelectedTab()[1];
    } else {
      this.panelState.selectTab(path);
    }
    const cBuff = this.buffers.get(selected) || makeEmptyBuffer();
    this.setState({
      currentBuffer: cBuff,
      view: cBuff?.view === "edit" ? "rendered" : "edit", // dirty hack to get it to refresh
    });
  };

  private saveEditState = (point: number) => {
    const b = { ...this.state.currentBuffer };
    b.point = point;
    this.setState({ currentBuffer: b });
  };

  private saveMode = (m: Mode) => {
    this.lastMode = m;
  };

  /** set the view and trigger a rerender */
  private toggleRendered = (t: boolean) => {
    const b = { ...this.state.currentBuffer };
    b.view = t ? "rendered" : "edit";
    console.log(b);
    this.setState({ view: b.view, currentBuffer: b });
  };

  render() {
    const buffer = this.state.currentBuffer;
    return (
      <TextPanel
        tabs={this.panelState.getTabs()}
        selectedTab={this.panelState.getSelectedTab()[0]}
        active={true}
        onClick={this.handleTabClick}
      >
        {(this.state.view === "edit" && (
          <BufferContainer
            bufferGap={buffer.bufferGap}
            initPoint={buffer.point}
            save={this.saveEditState}
            initMode={this.lastMode}
            clipBoard={this.clipBoard}
            marks={buffer.visualMarkers}
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

/** loads a file into a buffergap
 * @param path: path to the file
 * @return a buffergap with the contents of the file in it
 */
async function makeBufferFromFile(path: string): Promise<Buff> {
  const contents = await loadFile(path);
  const b = makeEmptyBuffer();
  b.bufferGap.insert(contents, 0);
  return b;
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
