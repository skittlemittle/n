enum EventCategory {
  Buffer, // letters and buffer commands
  Control, // keys for app level commands like ctrl and shift
  Nothing,
}

/**
 * The global keyboard handler
 *
 * Its main job is sending listeners only the events they asked for
 */
class KeyboardEvents {
  private listenerIds: Map<EventCategory, number[]>;
  private listeners: Map<number, handler>;
  private ID = 0;
  // fuck these
  private bufferIgnored = [
    "Insert",
    "PageUp",
    "PageDown",
    "CapsLock",
    "Escape",
  ];
  // not these tho 💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅💅
  private controlKeys = ["Shift", "Control", "Meta", "Alt", "Escape"];

  constructor() {
    this.listenerIds = new Map();
    this.listeners = new Map();
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
  }

  private onKeyDown(e: KeyboardEvent) {
    let c: EventCategory = EventCategory.Nothing;
    if (this.controlKeys.includes(e.key)) {
      c = EventCategory.Control;
    } else if (!this.bufferIgnored.includes(e.key)) {
      c = EventCategory.Buffer;
    }

    if (c !== EventCategory.Nothing) {
      this.listenerIds.get(c)?.forEach((id) => {
        const callback = this.listeners.get(id);
        if (callback) callback(e);
      });
    }
  }

  /**
   * @param category the type of keys you want to listen for
   * @returns the id of your listener, used to remove the listener
   */
  addListener(category: EventCategory, callback: handler): number {
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

  removeListener(id: number) {
    this.listeners.delete(id);
    // shut up
    this.listenerIds.forEach((ids) => {
      if (ids.includes(id)) ids.splice(ids.indexOf(id));
    });
  }
}

type handler = (e: KeyboardEvent) => void;

const deezNuts = new KeyboardEvents();
export { deezNuts as KeyboardEvents, EventCategory };
