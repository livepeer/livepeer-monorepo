// Wrapper around <MDXProvider> that injects all of our custom rendering.

import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "../components/CodeBlock";
import { Styled } from "theme-ui";
import Link from "next/link";

const components = {
  code: CodeBlock,
  inlineCode: Styled.code,
  h1: Styled.h1,
  h2: Styled.h2,
  h3: Styled.h3,
  h4: Styled.h4,
  h5: Styled.h5,
  a: Link,
};

export default ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
);
