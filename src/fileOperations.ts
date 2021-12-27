// stuff that talks to the backend

import {
  BaseDirectory,
  createDir,
  readDir,
  readTextFile,
  renameFile,
  writeFile,
} from "@tauri-apps/api/fs";

const Foptions = {
  dir: BaseDirectory.Home,
};

/**
 * @param path: path to the folder
 * @returns a FileEntry[] array of all the files / subdirs in this folder
 */
async function loadFolder(path: string) {
  return readDir(path, Foptions);
}

/**
 * @param path: path to the file
 * @returns the contents of the file as a string
 */
async function loadFile(path: string) {
  return readTextFile(path, Foptions);
}

/**
 * @param path: path to the file
 * @param contents: the stuff to write to the file
 */
async function saveFile(path: string, contents: string) {
  return writeFile({ path, contents }, Foptions);
}

/** @param path: path to the file */
async function newFile(path: string) {
  return saveFile(path, "");
}

/** @param path: path to the folder */
async function newFolder(path: string) {
  return createDir(path, Foptions);
}

/**
 * @param path: current path to the file
 * @param newPath: new path of the file
 */
async function rename(path: string, newPath: string) {
  return renameFile(path, newPath);
}

export { loadFolder, loadFile, saveFile, newFile, newFolder, rename };
