import styled from "styled-components";

const RenderedPanel = styled.div`
  @import url("https://rsms.me/inter/inter.css");

  background: #fbf1c7;
  color: #3c3836;

  padding: 3em 2em;
  margin: 0px;

  // font-family: 'Inter'      leave this commented out. css is stupid
  font-style: normal;
  font-size: 18px;

  // okay maybe this is kinda jank
  h1 {
    font-weight: 900;
    font-size: 60px;
    /* identical to box height, or 44% */
    letter-spacing: 0.005em;
    color: #9d001e;
    margin: 0px;
  }

  h2 {
    font-weight: 600;
    font-size: 50px;
    /* identical to box height, or 57% */
    letter-spacing: 0.005em;
    color: #af3a03;
    margin: 0px;
  }

  h3 {
    font-weight: 500;
    font-size: 40px;
    /* identical to box height, or 67% */
    letter-spacing: 0.005em;
    color: #b57614;
    margin: 0px;
  }

  h4 {
    font-weight: 500;
    font-size: 35px;
    /* identical to box height, or 80% */
    letter-spacing: 0.005em;
    color: #79740e;
    margin: 0px;
  }

  h5 {
    font-weight: 500;
    font-size: 30px;
    /* identical to box height, or 89% */
    letter-spacing: 0.005em;
    color: #427b58;
    margin: 0px;
  }

  em {
    font-weight: 200;
    /* identical to box height, or 133% */
    letter-spacing: 0.005em;
    margin: 0px;
  }

  code {
    font-family: source-code-pro, Consolas, monospace;
    background: #ebdbb2;
    padding: 0px 0.3em;
  }

  .code-block {
    font-family: source-code-pro, Consolas, monospace;
    background: #ebdbb2;
  }

  hr {
    height: 0.12em;
    padding: 0;
    border: none;
    border-radius: 3px;
    background-color: #d5c4a1;
  }
`;

export default RenderedPanel;
