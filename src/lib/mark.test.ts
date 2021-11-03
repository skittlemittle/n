import makeMarksList from "./mark";

const Marks = makeMarksList();
test("make mark, kill mark", () => {
  let m = Marks.getMark(Marks.createMark());
  expect(m?.location).toEqual(-1);
  expect(m?.fixed).toEqual(false);

  const l = 27;
  m = Marks.getMark(Marks.createMark(l));
  expect(m?.location).toEqual(l);
  expect(m?.fixed).toEqual(false);

  expect(Marks.removeMark(Marks.createMark())).toEqual(true);
  expect(Marks.removeMark("owo")).toEqual(true);
});

test("move mark and point around", () => {
  expect(Marks.whereIs("owo")).toEqual(undefined);

  let m = Marks.createMark();
  let point = 5;

  expect(Marks.whereIs(m)).toEqual(-1);
  Marks.moveMark(point, m);
  expect(Marks.whereIs(m)).toEqual(point);

  point = 90;
  const m_location = Marks.whereIs(m);
  expect(Marks.swapPointAndMark(point, m)).toEqual(m_location);
});

test("mark  point compares", () => {
  let point = 33;
  expect(Marks.pointAtMark(point, "owo")).toEqual(false);
  expect(Marks.pointBeforeMark(point, "owo")).toEqual(false);

  let m = Marks.createMark(196);

  expect(Marks.pointAtMark(point, m)).toEqual(false);
  expect(Marks.pointBeforeMark(point, m)).toEqual(true);
});
