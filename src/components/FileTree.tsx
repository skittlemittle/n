import { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "styled-components";
import { v4 as uuid } from "uuid";

import { loadFolder, newFile, newFolder } from "../fileOperations";
import ToolPanel, { TextBox } from "./styles/ToolPanel";
import IconButton from "./IconButton";
import ActionsRibbon from "./FileActions";

import arrow from "../assets/icons/arrow.svg";

/** file / folder entry type */
interface PathEntry {
  path: string;
  name: string;
  id: string;
  parentId: string;
  hasChildren: boolean;
  showChildren: boolean;
}

interface FboxProps {
  name: string;
  level: number;
  onClick: () => void;
}

const FolderTextBox = ({ name, level, onClick }: FboxProps) => {
  const themeContext = useContext(ThemeContext);
  return (
    <TextBox color={themeContext.colors.aqua} level={level} onClick={onClick}>
      <IconButton iconUrl={arrow} action={() => {}} size={[8, 8]} />
      {name}
    </TextBox>
  );
};

interface RTreeProps {
  dirTree: PathEntry[];
  foldDir: foldDir;
  fileClicked: requestFileLoad;
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
                <FolderTextBox
                  name={name}
                  level={level}
                  onClick={() => foldDir(entry.id)}
                />
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
  requestFileLoad: requestFileLoad;
  initRootDirectory: string;
}

const FileTree = ({ requestFileLoad, initRootDirectory }: FTreeProps) => {
  const [dirTree, setDirTree] = useState<PathEntry[]>([]);
  const [rootDirectory, changeRootDirectory] = useState(initRootDirectory);
  const rootId = "";

  useEffect(() => {
    let mounted = true;
    loadFolder(rootDirectory).then((f) => {
      if (mounted)
        setDirTree(
          f.map((e) => makeEntry(e, rootId, e.children !== undefined))
        );
    });
    return () => {
      mounted = false;
    };
  }, [rootDirectory]);

  /** folds and unfolds directories
   * @param id: the id of the folder
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

  /** @param path: relative path to the file from the current rootDirectory */
  const requestNewFile = (path: string) => {
    const p = `${rootDirectory}/${path}`;
    newFile(p)
      .then(() => {
        requestFileLoad(p);
      })
      .catch((e) => console.warn(`FileError:   ${e}`));
  };

  /** @param path: relative path to the folder from the current rootDirectory */
  const requestNewFolder = (path: string) => {
    newFolder(`${rootDirectory}/${path}`).catch((e) =>
      console.warn(`FileError:   ${e}`)
    );
  };

  /** @param path: path to the folder to open */
  const openFolder = (path: string) => {
    changeRootDirectory(path);
  };

  return (
    <ToolPanel>
      <ActionsRibbon
        newFile={requestNewFile}
        newFolder={requestNewFolder}
        open={openFolder}
      />
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
type requestFileLoad = (path: string) => void;

export default FileTree;
export type { requestFileLoad };
