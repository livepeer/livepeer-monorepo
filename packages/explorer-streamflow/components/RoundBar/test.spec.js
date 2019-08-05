import React from "react";
import renderer from "react-test-renderer";
import RoundBar from "./index";

describe("RoundBar", () => {
  it("renders correctly", () => {
    const component = renderer.create(<RoundBar />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
