import React from "react";
import renderer from "react-test-renderer";
import PageTitle from "./index";

describe("PageTitle", () => {
  it("renders correctly", () => {
    const component = renderer.create(<PageTitle />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
