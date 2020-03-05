import { pascalCase } from "pascal-case";
import { Element } from "react-scroll";
export const getComponent = component => {
  const componentName = pascalCase(component._type);
  try {
    const Component = require(`../components/${componentName}`).default;
    return (
      <Element
        offset={-20}
        key={component._type}
        id={component._type}
        name={component._type}
      >
        <Component {...component} />
      </Element>
    );
  } catch (e) {
    return null;
  }
};
