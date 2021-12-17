import Panel from "./panel";

test("add / close tabs", () => {
  const brudda = new Panel();
  brudda.addTab("owo");
  brudda.addTab("biz");
  expect(brudda.getTabs()).toEqual(["owo", "biz"]);
  expect(brudda.getSelectedTab()).toEqual([1, "biz"]);

  brudda.closeTab("biz");
  expect(brudda.getTabs()).toEqual(["owo"]);
  expect(brudda.getSelectedTab()).toEqual([0, "owo"]);

  brudda.addTab("the");
  brudda.addTab("T");
  brudda.selectTab("the");
  expect(brudda.getSelectedTab()).toEqual([1, "the"]);
  brudda.closeTab("the");
  expect(brudda.getSelectedTab()).toEqual([1, "T"]);
  brudda.closeTab("owo");
  expect(brudda.getSelectedTab()).toEqual([0, "T"]);
});

test("select tabs", () => {
  const brudda = new Panel();
  brudda.addTab("another one");
  brudda.addTab("ggggggggggggg");
  expect(brudda.getSelectedTab()).toEqual([1, "ggggggggggggg"]);
  brudda.selectTab("another one");
  expect(brudda.getSelectedTab()).toEqual([0, "another one"]);
});
