import Ribbon from "./styles/Ribbon";
import IconButton from "./IconButton";

interface props {
  buttons: { icon: string; action: () => void }[];
  dir: "left" | "right";
}

const Toolbar = ({ buttons, dir }: props) => {
  return (
    <Ribbon dir={dir}>
      {buttons.map((b, i) => (
        <IconButton iconUrl={b.icon} action={b.action} key={i} />
      ))}
    </Ribbon>
  );
};

export default Toolbar;
