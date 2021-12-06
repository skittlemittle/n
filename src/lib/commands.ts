// vim command stuff

const commandPatterns = [
  /\d+[bcdef.moprtuwy$`'}{hjkl]$/, // repeat? command
  /^[bcdef.moprtuwy$`'}{hjkl]$/,
  // takes movement
  /[cdy><]\d/,
  /[cdy><]['`hjklebfw0$}{]/,
  /dd|cc|yy|>>|<</, // dd, yy, etc
  /[cdy][t]/, // takes another command
  /[`'m]\w/, // takes mark names
  /[frt]./, // takes any char
  /\d+/, // number
];

/** validate additions to a command
 * @param c: command word, single char
 * @param command: the last typed in command, single char
 * @returns true if c is a valid next word in the command, false if it isnt.
 */
const validNextWord = (c: string, command: string): boolean => {
  if (c.length > 1) return false;
  return commandPatterns.some((regex) => regex.test(command + c));
};

/**
 * holds and validates vim commands as they get typed in.
 */
const makeCommand = () => {
  const command: string[] = [];

  const push = (c: string) => {
    if (validNextWord(c, command[command.length - 1])) {
      command.push(c);
      return true;
    }
    return false;
  };

  const flush = () => command.splice(0, command.length);

  return {
    push,
    flush,
  };
};

interface CommandStack {
  /** push the next bit of the command on, if it is a valid next command.
   * @param c: the command word to add to the command
   * @returns true if the command was pushed, false if the command was not valid
   */
  push: (c: string) => boolean;
  /** clear the command
   * @returns the command thus far
   */
  flush: () => string[];
}

export { makeCommand, validNextWord };
export type { CommandStack };
