import React from "react";
import renderer from "react-test-renderer";
import Header from "./index";

describe("Header", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Header />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
