import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";

import face from "../assets/icons/face.svg";
import Toolbar from "./Toolbar";

it("toolbar styles", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <Toolbar buttons={[{ icon: face, action: () => {} }]} dir={"right"} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
