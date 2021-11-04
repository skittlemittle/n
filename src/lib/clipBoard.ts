class ClipBoard {
  private clips: string[];
  private sizeLimit: number;

  constructor(sizeLimit = 20) {
    this.clips = [];
    this.sizeLimit = sizeLimit;
  }

  /** put the text on the top of the clipboard
   * @param text: thing to add to clipboard
   */
  paste(text: string) {
    this.clips.unshift(text);
    if (this.clips.length >= this.sizeLimit) {
      this.clips.splice(this.sizeLimit);
    }
  }

  /** get the text at index, 0 being the top
   * @param index: index of the text in the clipboard, default: 0
   * @return the text at index, false if the index is out of bounds of the clipboard
   */
  get(index = 0): string | false {
    if (index >= 0 && index < this.clips.length) return this.clips[index];
    return false;
  }
}

export default ClipBoard;
