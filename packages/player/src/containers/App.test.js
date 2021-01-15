import React from "react";
import { render } from "react-dom";
import store, { history } from "../store";
import Root from "./Root";
import App from "./App";

it("renders without crashing", async () => {
  render(
    <Root store={store} history={history}>
      <App />
    </Root>,
    document.createElement("div")
  );
});
