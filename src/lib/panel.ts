/** stores information about tabs in a editor panel.
 * For splits
 */
class Panel {
  /** names of buffers in this panel */
  private tabs: string[];
  /** index of the selected tab, -1 if tabs is empty */
  private selectedTab: number;

  constructor() {
    this.tabs = [];
    this.selectedTab = -1;
  }

  /** add a new tab and select it
   *  @param name the name of the buffer to be put in the new tab
   */
  addTab(name: string) {
    this.tabs.splice(this.selectedTab + 1, 0, name);
    this.selectedTab = this.tabs.indexOf(name);
  }

  /** close the tab with a specified buffer
   * @param name: name of the buffer in the tab.
   * @returns true on success false on failure.
   */
  closeTab(name: string): boolean {
    if (!this.tabs.includes(name)) return false;
    const i = this.tabs.indexOf(name);

    if (i === this.selectedTab) {
      if (this.tabs.length > 1) {
        if (this.selectedTab === this.tabs.length - 1)
          this.selectedTab = this.selectedTab - 1;
      } else {
        this.selectedTab = -1;
      }
    } else if (i < this.selectedTab) this.selectedTab--;

    this.tabs.splice(i, 1);
    return true;
  }

  /** @param name: the name of the tab to put at the "top" */
  selectTab(name: string) {
    if (this.tabs.includes(name)) this.selectedTab = this.tabs.indexOf(name);
  }

  getTabs() {
    return this.tabs;
  }

  /** @returns [index, name] of the top tab in this panels tab list */
  getSelectedTab(): [number, string] {
    return [this.selectedTab, this.tabs[this.selectedTab]];
  }
}

export default Panel;
