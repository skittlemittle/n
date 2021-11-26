import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";

import Buffer from "./Buffer";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("shows the right fookin text innit", () => {
  act(() => {
    render(
      <ThemeProvider theme={AppTheme}>
        <Buffer text="" point={0} />
      </ThemeProvider>,
      container
    );
  });
  expect(container.textContent).toBe("");

  act(() => {
    render(
      <ThemeProvider theme={AppTheme}>
        <Buffer text={"mmm testdsds?"} point={0} />
      </ThemeProvider>,
      container
    );
  });
  expect(container.textContent).toBe("mmm testdsds?");
});
