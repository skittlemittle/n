import Rendered from "./Rendered";

const text =
  "\
```\n \
                 ▒█████   █     █░ ▒█████  \n \
                ▒██▒  ██▒▓█░ █ ░█░▒██▒  ██▒\n \
                ▒██░  ██▒▒█░ █ ░█ ▒██░  ██▒\n \
                ▒██   ██░░█░ █ ░█ ▒██   ██░\n \
                ░ ████▓▒░░░██▒██▓ ░ ████▓▒░\n \
                ░ ▒░▒░▒░ ░ ▓░▒ ▒  ░ ▒░▒░▒░ \n \
                  ░ ▒ ▒░   ▒ ░ ░    ░ ▒ ▒░ \n \
                ░ ░ ░ ▒    ░   ░  ░ ░ ░ ▒  \n \
                    ░ ░      ░        ░ ░\n \
```\n \
\n \
\n \
**Toggle render:** Ctrl + Shift + m\n";

const NoFile = () => <Rendered text={text} toggleRendered={() => {}} />;

export default NoFile;
