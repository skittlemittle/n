enum EventCategory {
  Buffer, // letters and movement
  Mode,
  Nothing,
}

const bufferIgnored = [
  "Insert",
  "PageUp",
  "PageDown",
  "CapsLock",
  "Shift",
  "Control",
  "Meta",
  "Alt",
];

const modeKeys = [
  "i",
  "v",
  "Escape",
  "CapsLock",
  "Shift,V",
  "Control,Shift,M",
  "Control,v",
];
/**
 * The global keyboard handler
 *
 * Its main job is sending listeners only the events they asked for
 */
class KeyboardEvents {
  private listenerIds: Map<EventCategory, number[]>;
  private listeners: Map<number, handler>;
  private ID = 0;
  private pressed: string[]; // ordered list of the currently pressed keys

  constructor() {
    this.pressed = [];
    this.listenerIds = new Map();
    this.listeners = new Map();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  private call = (c: EventCategory, e: KeyboardEvent) => {
    this.listenerIds.get(c)?.forEach((id) => {
      const callback = this.listeners.get(id);
      if (callback) callback(e, this.pressed.toString());
    });
  };

  /** send currently pressed keys / key combos to the relevant subscribers */
  private onKeyDown(e: KeyboardEvent) {
    if (!this.pressed.includes(e.key)) {
      if (["Shift, Control"].includes(e.key)) this.pressed.unshift(e.key);
      else this.pressed.push(e.key);
    }

    if (modeKeys.includes(this.pressed.toString())) {
      this.call(EventCategory.Mode, e);
    }

    // tell the buffer right away about single keypresses
    if (!bufferIgnored.includes(e.key)) {
      this.call(EventCategory.Buffer, e);
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    this.pressed = this.pressed.filter(
      (k) => k.toLowerCase() !== e.key.toLowerCase()
    );
  }

  /**
   * subscribe to keyboard events
   * @param category the type of keys you want to listen for
   * @param callback the callback function to pass the event to,
   * this function takes two args: the event, and a comma separated
   * string containing the current keycombo
   * @returns the id of your listener, used to remove the listener
   */
  addListener(category: EventCategory, callback: handler): number {
    this.pressed = [];
    this.listeners.set(this.ID, callback);
    const ids = this.listenerIds.get(category);
    if (ids !== undefined) {
      ids.push(this.ID);
      this.listenerIds.set(category, ids);
    } else {
      this.listenerIds.set(category, [this.ID]);
    }
    this.ID++;
    return this.ID - 1;
  }

  /**
   * unsubscribes a listner from keyboard events
   * @param id your listeners id
   */
  removeListener(id: number) {
    this.listeners.delete(id);
    this.listenerIds.forEach((ids) => {
      if (ids.includes(id)) ids.splice(ids.indexOf(id));
    });
  }
}

/**callback function for keyboard events
 * @param e: the event
 * @param keys: a comma separated string of the currently held keys
 */
type handler = (e: KeyboardEvent, keys: string) => void;

const deezNuts = new KeyboardEvents();
export { deezNuts as KeyboardEvents, EventCategory, bufferIgnored, modeKeys };
