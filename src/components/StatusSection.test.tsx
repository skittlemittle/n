import React from "react";
import renderer from "react-test-renderer";
import StatusSection from "./StatusSection";

it("statusline section renders", () => {
  const tree1 = renderer
    .create(
      <StatusSection
        dir={"left"}
        textColor={"#fbf1c7"}
        color={"#7c6f64"}
        index={1}
      >
        V-LINE
      </StatusSection>
    )
    .toJSON();
  expect(tree1).toMatchSnapshot();

  const tree2 = renderer
    .create(
      <StatusSection
        dir={"right"}
        textColor={"#9d0006"}
        color={"#79740e"}
        index={4}
      >
        V-LINE
      </StatusSection>
    )
    .toJSON();
  expect(tree2).toMatchSnapshot();
});
