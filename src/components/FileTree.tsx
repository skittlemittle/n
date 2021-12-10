import { FileEntry } from "@tauri-apps/api/fs";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "styled-components";

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
  foldDir: (i: number) => void;
  level: number;
  startIndex: number;
}

/** recursively renders stuff in a directory */
const RenderTree = ({
  dirTree,
  foldDir,
  level,
  startIndex,
}: RTreeProps): JSX.Element => {
  const themeContext = useContext(ThemeContext);

  if (dirTree.length === 0)
    return (
      <TextBox color={themeContext.colors.bg3} level={level}>
        empty
      </TextBox>
    );
  return (
    <>
      {dirTree.map((entry, i) => {
        const name = entry.name || entry.path;
        if (entry.children !== undefined) {
          return (
            <>
              <TextBox
                color={themeContext.colors.aqua}
                level={level}
                onClick={() => foldDir(startIndex + i)}
                key={i}
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
                  dirTree={entry.children.map((f) => makeEntry(f))}
                  foldDir={foldDir}
                  level={level + 1}
                  startIndex={startIndex + i + 1}
                />
              )}
            </>
          );
        }
        return (
          <TextBox level={level} key={i}>
            {name}
          </TextBox>
        );
      })}
    </>
  );
};

const FileTree = () => {
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

  const foldDir = (index: number) => {
    const d = [...dirTree];
    d[index].showChildren = !d[index].showChildren;
    if (d[index].showChildren) {
      loadFolder(d[index].path)
        .then((f) => {
          d[index].children = f.map((e) => makeEntry(e));
          setDirTree(d);
        })
        .catch((e) => console.log(`FileError:   ${e}`));
    } else setDirTree(d);
  };

  return (
    <ToolPanel>
      <RenderTree
        dirTree={dirTree}
        foldDir={foldDir}
        startIndex={0}
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

export default FileTree;
