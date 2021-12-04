import { validNextWord, makeCommandStack } from "./commands";

const goodCommands = [
  "cw",
  "dd",
  "yto",
  "y`a",
  "mv",
  "'v",
  "`v",
  "800j",
  "d3k",
  "5yy",
  "3th",
  "4}",
  ">>",
  "b",
  "h",
];

const badCommands = ["q"]; // TODO cope

test("command validation", () => {
  const cStack = makeCommandStack();

  goodCommands.forEach((c) => {
    c.split("").forEach((i) => cStack.push(i));
    expect(validNextWord(c, cStack.flush())).toEqual(true);
  });

  cStack.flush();
  badCommands.forEach((c) => {
    c.split("").forEach((i) => cStack.push(i));
    expect(validNextWord(c, cStack.flush())).toEqual(false);
  });
});
