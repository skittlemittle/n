// vim command stuff

const commandPatterns = [
  /\d?[bcdef.moprtuwy$`'}{hjkl]/, // repeat? command
  // takes movement
  /[cdy><]\d/,
  /[cdy><]['`hjklebfw0$}{]/,
  /dd|cc|yy|>>|<</, // dd, yy, etc
  /[cdy][t]/, // takes another command
  /[`'m]\w/, // takes mark names
  /[frt]./, // takes any char
  /\d\d/, // number
];

/** validate additions to a command
 * @param c: command word
 * @param stack: the current command stack
 * @returns true if c is a valid next word in the command, false if it isnt.
 */
const validNextWord = (c: string, stack: string[]): boolean => {
  let l = "";
  [c, ...stack].forEach((char) => (l = l.concat(char)));
  return commandPatterns.some((regex) => regex.test(l));
};

/**
 * holds and validates vim commands as they get typed in.
 */
const makeCommandStack = () => {
  const cStack: string[] = [];

  const push = (c: string) => {
    if (validNextWord(c, cStack)) {
      cStack.unshift(c);
      return true;
    }
    return false;
  };

  const flush = () => cStack.splice(0, cStack.length);

  return {
    push,
    flush,
  };
};

interface CommandStack {
  /** push the next bit of the command on, if it is a valid next command.
   * @param c: the command word to put on the stack
   * @returns true if the command was pushed, false if the command was not valid
   */
  push: (c: string) => boolean;
  /** empty the stack
   * @returns the contents of the stack
   */
  flush: () => string[];
}

export { makeCommandStack, validNextWord };
export type { CommandStack };
