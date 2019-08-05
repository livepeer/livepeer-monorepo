import React from "react";
import renderer from "react-test-renderer";
import Nav from "./index";

describe("Nav", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Nav />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
