import nameFromPath from "./nameFromPath";

test("extract name from file path", () => {
  expect(nameFromPath("/waluigi_zone/zone1.wav")).toEqual("zone1.wav");
  expect(nameFromPath("\\waluigi_zone\\zone1.wav", true)).toEqual("zone1.wav");
  expect(nameFromPath("\\waluigi_zone\\zone1.wav")).toEqual(
    "\\waluigi_zone\\zone1.wav"
  );

  expect(nameFromPath("gaming/\\waluigi_zone\\zone1.wav")).toEqual(
    "\\waluigi_zone\\zone1.wav"
  );

  expect(nameFromPath("\\waluigi_zone\\zone1/owo.wav", true)).toEqual(
    "zone1/owo.wav"
  );

  expect(nameFromPath("")).toEqual("");
});
