import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TestComponent = styled.div`
  color: red;
`;

export default () => {
  console.log("hello");
  const [jsontext, setJsonText] = useState("Loading...");
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => response.json())
      .then(json => {
        setJsonText(json.title);
      });
  });
  return <div>{jsontext}</div>;
};
