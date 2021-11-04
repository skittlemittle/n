import ClipBoard from "./clipBoard";

const bigC = new ClipBoard(5);

test("paste and get stuff", () => {
  bigC.paste("tell you a whole heap");
  bigC.paste("of a spaghetti pile of INFORMATIONE");

  expect(bigC.get()).toEqual("of a spaghetti pile of INFORMATIONE");
  expect(bigC.get(1)).toEqual("tell you a whole heap");
  expect(bigC.get(3)).toEqual(false);
});

test("keep clipboard small", () => {
  bigC.paste("heres my brother luigi now to");
  bigC.paste("hello mario");
  bigC.paste("ay");

  expect(bigC.get()).toEqual("ay");
  expect(bigC.get(4)).toEqual("tell you a whole heap");
  bigC.paste("ay2");
  expect(bigC.get(4)).toEqual("of a spaghetti pile of INFORMATIONE");
});
