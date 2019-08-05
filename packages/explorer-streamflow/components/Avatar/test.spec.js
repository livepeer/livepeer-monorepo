import React from "react";
import renderer from "react-test-renderer";
import Avatar from "./index";

describe("Avatar", () => {
  it("renders correctly", () => {
    const component = renderer.create(<Avatar />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
