import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";
import CursorLayer from "./CursorLayer";

it("cursor block", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <div id="gaming">
          <CursorLayer
            position={{ row: 300, column: 300 }}
            size={{ height: 19, width: 6 }}
            parent={"gaming"}
            block={true}
          />
        </div>
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("cursor line", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <div id="gaming">
          <CursorLayer
            position={{ row: 300, column: 300 }}
            size={{ height: 19, width: 6 }}
            parent={"gaming"}
            block={false}
          />
        </div>
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
