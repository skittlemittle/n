import styled from "styled-components";

const RenderedPanel = styled.div`
  background: ${(props) => props.theme.colors.bg0};
  color: ${(props) => props.theme.colors.fg1};

  padding: 3em 2em;
  margin: 0px;

  font-family: "Inter";
  font-style: normal;
  font-size: 18px;

  // okay maybe this is kinda jank
  h1 {
    font-weight: 900;
    font-size: 60px;
    letter-spacing: 0.005em;
    color: ${(props) => props.theme.colors.red};
    margin: 0px;
  }

  h2 {
    font-weight: 600;
    font-size: 50px;
    letter-spacing: 0.005em;
    color: ${(props) => props.theme.colors.orange};
    margin: 0px;
  }

  h3 {
    font-weight: 500;
    font-size: 40px;
    letter-spacing: 0.005em;
    color: ${(props) => props.theme.colors.yellow};
    margin: 0px;
  }

  h4 {
    font-weight: 500;
    font-size: 35px;
    letter-spacing: 0.005em;
    color: ${(props) => props.theme.colors.green};
    margin: 0px;
  }

  h5 {
    font-weight: 500;
    font-size: 30px;
    letter-spacing: 0.005em;
    color: ${(props) => props.theme.colors.aqua};
    margin: 0px;
  }

  em {
    font-weight: 200;
    font-style: italic;
    letter-spacing: 0.005em;
    margin: 0px;
  }

  code {
    font-family: "JetBrains Mono", Consolas, monospace;
    background: ${(props) => props.theme.colors.bg1};
    padding: 0px 0.3em;
    border-radius: 2px;
  }

  .code-block {
    background: ${(props) => props.theme.colors.bg1};
    padding: 0px;
    border-radius: 3px;
  }

  hr {
    height: 0.12em;
    padding: 0;
    border: none;
    border-radius: 3px;
    background-color: ${(props) => props.theme.colors.bg2};
  }
`;

export default RenderedPanel;
