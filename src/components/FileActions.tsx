import { useState } from "react";
import styled from "styled-components";

import newfile from "../assets/icons/new_file.svg";
import newfolder from "../assets/icons/new_folder.svg";
import TextButton from "./styles/TextButton";
import { TextInput, useInput } from "./TextInput";
import { Flex } from "./styles/Boxes";
import IconButton from "./IconButton";

const Buttons = styled(Flex)`
  padding: 0.2em 0em;
`;

type fileRequest = (path: string) => void;
type ButtonAction = "" | "file" | "folder" | "open";
interface ActionsProps {
  newFile: fileRequest;
  newFolder: fileRequest;
  open: fileRequest;
}

/** le new file / open folder stuff */
const ActionsRibbon = ({ newFile, newFolder, open }: ActionsProps) => {
  const s = 25;
  const inputProps = useInput("");
  const [showInput, toggleInputVis] = useState(true);
  const [button, changeButton] = useState("" as ButtonAction);

  return (
    <>
      <Buttons direction="row">
        <IconButton
          iconUrl={newfile}
          action={() => {
            toggleInputVis(!showInput);
            changeButton("file");
          }}
          size={[s, s]}
        />
        <IconButton
          iconUrl={newfolder}
          action={() => {
            toggleInputVis(!showInput);
            changeButton("folder");
          }}
          size={[s, s]}
        />
        <TextButton
          onClick={() => {
            toggleInputVis(!showInput);
            changeButton("open");
          }}
        >
          open folder
        </TextButton>
      </Buttons>
      <form
        hidden={showInput}
        onSubmitCapture={(e) => {
          e.preventDefault();
          toggleInputVis(true);
          if (button === "file") newFile(inputProps.value);
          else if (button === "folder") newFolder(inputProps.value);
          else if (button === "open") open(inputProps.value);
        }}
      >
        <TextInput {...inputProps} />
        <input type="submit" style={{ display: "none" }} />
      </form>
    </>
  );
};

export default ActionsRibbon;
