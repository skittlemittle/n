import BufferGap from "./bufferGap";

test("insert text", () => {
  const bg = new BufferGap();
  bg.insert("a", 0);
  expect(bg.getContents()).toEqual("a");
  bg.insert("deez nuts", 1);
  expect(bg.getContents()).toEqual("adeez nuts");
  bg.insert("8", 0);
  expect(bg.getContents()).toEqual("8adeez nuts");
  bg.insert("my name jeff", 3);
  expect(bg.getContents()).toEqual("8admy name jeffeez nuts");
});

test("delete text", () => {
  const bg = new BufferGap();
  bg.insert("8admy name jeffeez nuts", 0);

  bg.delete(false, 1, 5);
  expect(bg.getContents()).toEqual("8adm name jeffeez nuts");
  bg.delete(true, 5, 5);
  expect(bg.getContents()).toEqual("8adm jeffeez nuts");
  bg.delete(false, 4, 17);
  expect(bg.getContents()).toEqual("8adm jeffeez ");
  bg.delete(false, 0, 2);
  expect(bg.getContents()).toEqual("8adm jeffeez ");
  bg.delete(true, 26, 0);
  expect(bg.getContents()).toEqual("");
});

test("get sections", () => {
  const bg = new BufferGap();
  bg.insert("8admy name jeffeez nuts and this is obabam and hahaha", 0);

  expect(bg.getSection(6, 27)).toEqual("name jeffeez nuts and");
});
