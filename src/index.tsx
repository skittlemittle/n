import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import App from "./components/App";
import { AppTheme } from "./theme";
import { ThemeProvider } from "styled-components";
import { loadFolder, newFolder } from "./fileOperations";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={AppTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// try to make the notes folder
try {
  loadFolder("smiling_man_dimension").catch((e) => {
    console.log(`FileWarn:  ${e}`);
    newFolder("smiling_man_dimension").catch((e) =>
      console.warn("FileError:  couldnt make notes folder")
    );
  });
} catch (error) {
  console.warn("nae file operations");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
