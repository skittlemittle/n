/** Buffer gap text container.
 * see: https://www.finseth.com/craft/#c6.4.3
 */
class BufferGap {
  private before: string;
  private after: string;
  private gap: number; // gap is just an index: before + 1

  constructor() {
    this.before = "";
    this.after = "";
    this.gap = 0;
  }

  /**
   * @param text the text to insert
   * @param point cursors location in buffer
   */
  insert(text: string, point: number) {
    this.moveGap(point);
    this.before = this.before.concat(text);
    this.gap = this.before.length;
  }

  /**
   * @param direction: true: right, false: left
   * @param amount: amount of chars to delete, must be a positive int > 0
   * @param point: cursor location in buffer
   */
  delete(direction: boolean, amount: number = 1, point: number) {
    if (amount <= 0) return;
    this.moveGap(point);
    if (direction) {
      this.after = this.after.substring(amount);
    } else {
      this.before = this.before.substring(0, this.before.length - amount);
      this.gap -= amount;
    }
  }

  /** @returns everything in the buffer */
  getContents(): string {
    return this.before.concat(this.after);
  }

  /**
   * @param from: char to start on
   * @param to: char to end on
   * @returns the contents of the buffer in the range [from, to)
   */
  getSection(from: number, to: number) {
    return this.before.concat(this.after).slice(from, to);
  }

  /** @param point: cursors position in text coordinates */
  private moveGap(point: number) {
    if (this.gap < point) {
      // const move = this.after.splice(0, point - this.gap);
      const move = this.after.substring(0, point - this.gap);
      this.before = this.before.concat(move);
      this.after = this.after.substring(point - this.gap);
      this.gap = point;
    } else if (this.gap > point) {
      const move = this.before.substring(point, this.gap);
      this.after = move + this.after;
      this.before = this.before.substring(0, point);
      this.gap = point;
    }
  }

  /** converts a location from text coordinates to gap coordinates
   * @returns the location in gap coordinates
   */
  private toGapCoords(location: number): number {
    if (location < this.gap) return location;
    else return location + 1;
  }
}

export default BufferGap;
