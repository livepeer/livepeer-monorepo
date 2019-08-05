import React from "react";
import renderer from "react-test-renderer";
import Chip from "./index";

describe("Chip", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Chip />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
