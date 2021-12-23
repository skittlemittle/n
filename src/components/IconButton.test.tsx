import renderer from "react-test-renderer";
import IconButton from "./IconButton";
import face from "../assets/icons/face.svg";

it("ToolbarButton renders", () => {
  const tree = renderer
    .create(<IconButton iconUrl={face} action={() => {}} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
