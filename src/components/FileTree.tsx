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
  id: string;
  parentId: string;
  hasChildren: boolean;
  showChildren: boolean;
}

interface RTreeProps {
  dirTree: PathEntry[];
  foldDir: foldDir;
  fileClicked: (p: string) => void;
  level: number;
  parentId: string;
}

/** recursively renders stuff in a directory */
const RenderTree = ({
  dirTree,
  foldDir,
  fileClicked,
  level,
  parentId,
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
      {dirTree
        .filter((e) => e.parentId === parentId)
        .map((entry) => {
          const name = entry.name || entry.path;
          if (entry.hasChildren) {
            return (
              <div key={uuid()}>
                <TextBox
                  color={themeContext.colors.aqua}
                  level={level}
                  onClick={() => foldDir(entry.id)}
                >
                  <ToolbarButton
                    iconUrl={arrow}
                    action={() => {}}
                    size={[8, 8]}
                  />
                  {name}
                </TextBox>
                {entry.showChildren && (
                  <RenderTree
                    dirTree={dirTree}
                    foldDir={foldDir}
                    fileClicked={fileClicked}
                    level={level + 1}
                    parentId={entry.id}
                  />
                )}
              </div>
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
  const rootId = "";

  useEffect(() => {
    let mounted = true;
    loadFolder("projects").then((f) => {
      if (mounted)
        setDirTree(
          f.map((e) => makeEntry(e, rootId, e.children !== undefined))
        );
    });
    return () => {
      mounted = false;
    };
  }, []);

  /** folds and unfolds directories
   * @param index: the items index in the file array eg: [0, 3]
   */
  const foldDir: foldDir = (id: string) => {
    let d = [...dirTree];
    const index = d.findIndex((it) => it.id === id);
    d[index].showChildren = !d[index].showChildren;

    if (d[index].showChildren) {
      d = d.filter((e) => e.parentId !== id); // potentially stale

      loadFolder(d[index].path)
        .then((f) => {
          d.push(...f.map((e) => makeEntry(e, id, e.children !== undefined)));
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
        level={0}
        parentId={rootId}
      />
    </ToolPanel>
  );
};

const makeEntry = (
  file: FileEntry,
  parentId: string,
  hasChildren: boolean
): PathEntry => ({
  path: file.path,
  name: file.name || file.path,
  id: uuid(),
  parentId,
  hasChildren,
  showChildren: false,
});

type foldDir = (index: string) => void;

export default FileTree;
