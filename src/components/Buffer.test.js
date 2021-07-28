import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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
    render(<Buffer text="" point={0} />, container);
  });
  expect(container.textContent).toBe("");

  act(() => {
    render(<Buffer text="owo" point={0} />, container);
  });
  expect(container.textContent).toBe("owo");

  act(() => {
    render(
      <Buffer text={"owo \n did it break the line?"} point={0} />,
      container
    );
  });
  expect(container.textContent).toBe("owo  did it break the line?");
});
