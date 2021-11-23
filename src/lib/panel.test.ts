import Panel from "./panel";

const brudda = new Panel();

test("add / close tabs", () => {
  brudda.addTab("owo");
  brudda.addTab("biz");
  expect(brudda.getTabs()).toEqual(["owo", "biz"]);

  brudda.closeTab("biz");
  expect(brudda.getTabs()).toEqual(["owo"]);
});

test("select tabs", () => {
  expect(brudda.getSelectedTab()).toEqual(-1);
  brudda.selectTab("owo");
  expect(brudda.getSelectedTab()).toEqual(0);
});
