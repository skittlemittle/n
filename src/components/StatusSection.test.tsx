import React from "react";
import renderer from "react-test-renderer";
import StatusSection from "./StatusSection";

it("statusline section renders", () => {
  const tree = renderer
    .create(<StatusSection dir={"left"}>V-LINE</StatusSection>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
