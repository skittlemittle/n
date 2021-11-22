import renderer from "react-test-renderer";
import ToolbarButton from "./ToolbarButton";
import face from "../assets/icons/face.svg";

it("ToolbarButton renders", () => {
  const tree = renderer
    .create(<ToolbarButton iconUrl={face} action={() => {}} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
