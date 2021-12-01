import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";
import Menu from "./Menu";

it("menu style", () => {
  const m = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        {" "}
        <Menu
          items={[
            {
              text: "owo",
              action: () => {},
            },
            {
              text: "big chungus zone",
              action: () => {},
            },
            {
              text: "big chungus zone",
              action: () => {},
            },
            {
              text: "big chungus zone",
              action: () => {},
            },
          ]}
          top={200}
          left={200}
        />
      </ThemeProvider>
    )
    .toJSON();
  expect(m).toMatchSnapshot();
});
