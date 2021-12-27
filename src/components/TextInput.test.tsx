import renderer from "react-test-renderer";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";

import { TextInput, useInput } from "./TextInput";

it("styles", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <TextInput value="gaming" />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

afterEach(cleanup);

const InputWrapper = () => {
  const props = useInput("bababooey");
  return <TextInput {...props} />;
};

it("useInput", () => {
  const { queryByDisplayValue, getByDisplayValue } = render(
    <ThemeProvider theme={AppTheme}>
      <InputWrapper />
    </ThemeProvider>
  );

  expect(queryByDisplayValue(/bababooey/i)).toBeTruthy();
  fireEvent.change(getByDisplayValue(/bababooey/i), { target: { value: "g" } });

  expect(queryByDisplayValue(/g/i)).toBeTruthy();
});
