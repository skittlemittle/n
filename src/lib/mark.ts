/*
 * Marker management system for text buffer
 * spec stolen clean off: https://www.finseth.com/craft/#c6.3
 *
 * makes selection possible
 */

interface Mark {
  location: number | -1;
  fixed: boolean;
}

const makeMarkList = (): MarkList => {
  const markTable: Map<string, Mark> = new Map();

  /** make a new unfixed mark at location
   * @param location: where in the text to place the mark, positive int, optinal.
   * @return a mark, the marks location field is set to location if location passed is a positive int, -1 otherwise
   */
  const createMark = (location?: number): string => {
    const m = {
      location: location !== undefined && location >= 0 ? location : -1,
      fixed: false,
    };
    const name = (Math.random() + 1).toString(36).substring(2);
    markTable.set(name, m);
    return name;
  };

  /** remove a mark
   * @param name: the marks name
   * @return true on success or if the mark doesnt exist, false if the mark couldnt be removed
   */
  const removeMark = (name: string): boolean => {
    if (markTable.get(name)) return markTable.delete(name);
    return true;
  };

  /** get a mark by its name
   * @param name: the marks name
   * @return the mark with the given name, undefined if it doesnt exist
   */
  const getMark = (name: string): Mark | undefined => markTable.get(name);

  /** get the location of a mark
   * @param name: the marks name
   * @return: location of the mark if it exists, undefined if it doesnt exist
   */
  const whereIs = (name: string): number | undefined => {
    const l = markTable.get(name)?.location;
    return typeof l === "number" ? l : undefined;
  };

  /** move the mark to some location in the text if the mark exists
   * @param location: a positive int
   * @param name: name of the mark
   */
  const moveMark = (location: number, name: string) => {
    const m = markTable.get(name);
    if (m) {
      m.location = location;
      markTable.set(name, m);
    }
  };

  /** swap the location of the mark and point
   * @param point: the point
   * @param name: the marks name
   * @return the points new location on success, false otherwise
   */
  const swapPointAndMark = (point: number, name: string): number | false => {
    const m = markTable.get(name);
    if (m) {
      const ml = m.location;
      m.location = point;
      return ml;
    }
    return false;
  };

  /**
   * @param point point
   * @param name marks name
   * @returns true if the point is at the mark, false if it isnt
   */
  //prettier-ignore
  const pointAtMark = (point: number, name: string): boolean => (
    markTable.get(name)?.location === point
  );

  /**
   * @param point point
   * @param name marks name
   * @returns true if the point is before the mark, false if it isnt
   */
  const pointBeforeMark = (point: number, name: string): boolean => {
    const l = markTable.get(name)?.location;
    return l !== undefined ? l > point : false;
  };

  return {
    createMark,
    removeMark,
    getMark,
    whereIs,
    moveMark,
    swapPointAndMark,
    pointAtMark,
    pointBeforeMark,
  };
};

interface MarkList {
  createMark: (location?: number) => string;
  removeMark: (name: string) => boolean;
  getMark: (name: string) => Mark | undefined;
  whereIs: (name: string) => number | undefined;
  moveMark: (location: number, name: string) => void;
  swapPointAndMark: (point: number, name: string) => number | false;
  pointAtMark: (point: number, name: string) => boolean;
  pointBeforeMark: (point: number, name: string) => boolean;
}

export default makeMarkList;
export type { MarkList };
