import Ribbon from "./styles/Ribbon";
import ToolbarButton from "./ToolbarButton";

interface props {
  buttons: { icon: string; action: () => void }[];
  dir: "left" | "right";
}

const Toolbar = ({ buttons, dir }: props) => {
  return (
    <Ribbon dir={dir}>
      {buttons.map((b, i) => (
        <ToolbarButton iconUrl={b.icon} action={b.action} key={i} />
      ))}
    </Ribbon>
  );
};

export default Toolbar;
