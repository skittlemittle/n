/** returns the filename from a path (the last bit)
 * @param path path to a file
 * @param binbows flag for dos paths, true: binbows, false: unix. defaults to false
 * @return name
 */
function nameFromPath(path: string, binbows: boolean = false) {
  const c = binbows ? "\\" : "/";
  return path.split(c).pop();
}

export default nameFromPath;
