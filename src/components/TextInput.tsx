import React, { useState } from "react";
import styled from "styled-components";

/** input state handling  */
function useInput(defaultVal: string) {
  const [value, setValue] = useState(defaultVal);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return { value, onChange };
}

const TextInput = styled.input`
  margin: 0.15em 0.25em;
  border: 1px solid ${(props) => props.theme.colors.orange};
  color: ${(props) => props.theme.colors.fg1};
  background-color: inherit;

  &:focus {
    outline: none !important;
    border-color: ${(props) => props.theme.colors.orange_l};
  }

  ::selection {
    background-color: ${(props) => props.theme.colors.bg_select};
  }
`;

export { TextInput, useInput };
