import styled from "styled-components";

const RenderedPanel = styled.div`
  background: ${(props) => props.theme.colors.bg0};
  color: ${(props) => props.theme.colors.fg1};

  padding: 1em 2em;
  margin: 0px;
  flex: 1 1 auto;
  overflow-y: auto;

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

  del {
    text-decoration: line-through;
    color: ${(props) => props.theme.colors.fg3};
  }

  input[type="checkbox" i] {
    appearance: none;
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.colors.orange};
    width: 1em;
    height: 1em;
    position: relative;
    top: 3px;
    margin: 3px;

    &:checked {
      background-color: ${(props) => props.theme.colors.orange_l};
      box-shadow: inset 0 0 0 2px ${(props) => props.theme.colors.bg1};
    }
  }

  a {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    color: ${(props) => props.theme.colors.blue_l};
  }

  blockquote {
    background: ${(props) => props.theme.colors.bg3 + "46"};
    border-radius: 2px;
    padding: 1px 1em;
    border-left: 4px solid ${(props) => props.theme.colors.purple_l};
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
`;

export default RenderedPanel;
