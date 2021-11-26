import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";
import StatusLine from "./StatusLine";

it("insert colors", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <StatusLine
          stats={{
            mode: "insert",
            left: ["INSERT", "some file", "8?"],
            right: ["3% : 3/300", "hah", "hheh"],
          }}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("rendered colors", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <StatusLine
          stats={{
            mode: "rendered",
            left: ["RENDERED"],
            right: ["3% : 3/300"],
          }}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("visual colors", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <StatusLine
          stats={{
            mode: "visual",
            left: ["V_BLOCK", "owo", "3"],
            right: ["3% : 3/300", "ae", "r"],
          }}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("normal colors", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <StatusLine
          stats={{
            mode: "normal",
            left: ["NORMAL", "hm", "3"],
            right: ["3% : 3/300", "ae", "r"],
          }}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
