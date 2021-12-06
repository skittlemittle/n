import { validNextWord, makeCommand } from "./commands";

test("command validation", () => {
  // single word
  expect(validNextWord("b", "")).toEqual(true);
  expect(validNextWord("p", "")).toEqual(true);
  expect(validNextWord("}", "")).toEqual(true);
  // single with repeat
  expect(validNextWord("b", "900")).toEqual(true);
  expect(validNextWord("p", "12")).toEqual(true);
  // movement
  expect(validNextWord("5", "d")).toEqual(true);
  expect(validNextWord("w", "c")).toEqual(true);
  expect(validNextWord("$", "y")).toEqual(true);
  expect(validNextWord("y", "d")).toEqual(false);
  expect(validNextWord("c", "d")).toEqual(false);
  // dd, yy, cc
  expect(validNextWord("d", "d")).toEqual(true);
  expect(validNextWord(">", ">")).toEqual(true);
  expect(validNextWord(">", "<")).toEqual(false);
  // t
  expect(validNextWord("t", "d")).toEqual(true);
  // mark
  expect(validNextWord("q", "m")).toEqual(true);
  // char
  expect(validNextWord("f", "r")).toEqual(true);
  expect(validNextWord("*", "f")).toEqual(true);
  // numbers
  expect(validNextWord("3", "9")).toEqual(true);
});

test("make command", () => {
  const command = makeCommand();

  expect(command.push("c")).toEqual(true);
  expect(command.push("w")).toEqual(true);

  expect(command.flush()).toEqual(["c", "w"]);

  expect(command.push("8")).toEqual(true);
  expect(command.push("0")).toEqual(true);
  expect(command.push("y")).toEqual(true);
  expect(command.push("k")).toEqual(true);
  expect(command.flush()).toEqual(["8", "0", "y", "k"]);

  // multiple chars
  expect(command.push("rat")).toEqual(false);
});
