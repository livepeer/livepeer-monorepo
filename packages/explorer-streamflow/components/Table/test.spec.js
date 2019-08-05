import React from "react";
import renderer from "react-test-renderer";
import CardList from "./index";

describe("CardList", () => {
  it("renders correctly", () => {
    const component = renderer.create(<CardList />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
