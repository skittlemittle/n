import renderer from "react-test-renderer";
import IconButton from "./IconButton";
import face from "../assets/icons/face.svg";
import { ThemeProvider } from "styled-components";
import { AppTheme } from "../theme";

it("ToolbarButton renders", () => {
  const tree = renderer
    .create(
      <ThemeProvider theme={AppTheme}>
        <IconButton iconUrl={face} action={() => {}} />
      </ThemeProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
