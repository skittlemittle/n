import { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "styled-components";
import { v4 as uuid } from "uuid";

import { loadFolder } from "../fileOperations";
import ToolPanel, { TextBox } from "./styles/ToolPanel";
import arrow from "../assets/icons/arrow.svg";
import ToolbarButton from "./ToolbarButton";

interface PathEntry {
  path: string;
  name: string;
  children: PathEntry[] | undefined;
  showChildren: boolean;
}

interface RTreeProps {
  dirTree: PathEntry[];
  foldDir: foldDir;
  fileClicked: (p: string) => void;
  level: number;
  /** this things index in the PathEntry array */
  entryIndex: number[];
}

/** recursively renders stuff in a directory */
const RenderTree = ({
  dirTree,
  foldDir,
  fileClicked,
  level,
  entryIndex,
}: RTreeProps): JSX.Element => {
  const themeContext = useContext(ThemeContext);

  if (dirTree.length === 0) {
    return (
      <TextBox color={themeContext.colors.bg3} level={level} key={uuid()}>
        empty
      </TextBox>
    );
  }

  return (
    <div>
      {dirTree.map((entry, i) => {
        const name = entry.name || entry.path;
        if (entry.children !== undefined) {
          const eIndex = [...entryIndex, i];
          return (
            <TextBox
              color={themeContext.colors.aqua}
              level={level}
              onClick={() => foldDir(eIndex)}
              key={uuid()}
            >
              <ToolbarButton iconUrl={arrow} action={() => {}} size={[8, 8]} />
              {name}
              {entry.showChildren && (
                <RenderTree
                  dirTree={entry.children.map((f) => makeEntry(f))}
                  foldDir={foldDir}
                  fileClicked={fileClicked}
                  level={level + 1}
                  entryIndex={eIndex}
                />
              )}
            </TextBox>
          );
        }
        return (
          <TextBox
            level={level}
            onClick={() => fileClicked(entry.path)}
            key={uuid()}
          >
            {name}
          </TextBox>
        );
      })}
    </div>
  );
};

interface FTreeProps {
  requestFileLoad: (p: string) => void;
}

const FileTree = ({ requestFileLoad }: FTreeProps) => {
  const [dirTree, setDirTree] = useState<PathEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    loadFolder("projects").then((f) => {
      if (mounted) setDirTree(f.map((e) => makeEntry(e)));
    });
    return () => {
      mounted = false;
    };
  }, []);

  /** folds and unfolds directories
   * @param index: the items index in the file array eg: [0, 3]
   */
  const foldDir: foldDir = (index: number[]) => {
    const d = [...dirTree];

    let entry: PathEntry = d[index[0]];
    index.shift();
    for (const i of index) {
      if (entry.children !== undefined) entry = entry.children[i];
      else {
        console.warn(`FileWarn:  file entry ${i} has no children`);
        break;
      }
    }
    entry.showChildren = !entry.showChildren;
    if (entry.showChildren) {
      loadFolder(entry.path)
        .then((f) => {
          entry.children = f.map((e) => makeEntry(e));
          d[index[0]] = entry;
          setDirTree(d);
        })
        .catch((e) => console.log(`FileError:   ${e}`));
    } else setDirTree(d);
  };

  /** handles clicks on files */
  const fileClicked = (path: string) => {
    requestFileLoad(path);
  };

  return (
    <ToolPanel>
      <RenderTree
        dirTree={dirTree}
        foldDir={foldDir}
        fileClicked={fileClicked}
        entryIndex={[]}
        level={0}
      />
    </ToolPanel>
  );
};

const makeEntry = (file: FileEntry): PathEntry => ({
  path: file.path,
  name: file.name || file.path,
  children:
    file.children !== undefined
      ? file.children.map((c) => makeEntry(c))
      : undefined,
  showChildren: false,
});

type foldDir = (index: number[]) => void;

export default FileTree;
