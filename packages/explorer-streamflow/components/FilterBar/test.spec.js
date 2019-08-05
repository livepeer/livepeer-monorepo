import React from "react";
import renderer from "react-test-renderer";
import FilterBar from "./index";

describe("FilterBar", () => {
  it("renders correctly", () => {
    const component = renderer.create(<FilterBar />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
