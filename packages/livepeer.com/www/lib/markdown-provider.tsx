// Wrapper around <MDXProvider> that injects all of our custom rendering.

import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "../components/CodeBlock";
import { Styled } from "theme-ui";
import Link from "next/link";
import { useRouter } from "next/router";

const StyledA = ({ href, children }) => {
  const router = useRouter();
  let opacity = 0.65;
  if (router.pathname === href) {
    opacity = 1;
  }
  const isInternal = href.startsWith("/");
  const internalA = (
    <a
      href={href}
      target={isInternal ? undefined : "_blank"}
      sx={{
        textDecoration: "none",
        cursor: "pointer",
        opacity: opacity,
        "&:hover": { opacity: 1 },
      }}
    >
      {children}
    </a>
  );

  if (!isInternal) {
    return internalA;
  }

  return <Link href={href}>{internalA}</Link>;
};

const components = {
  code: CodeBlock,
  inlineCode: Styled.code,
  h1: Styled.h1,
  h2: Styled.h2,
  h3: Styled.h3,
  h4: Styled.h4,
  h5: Styled.h5,
  a: StyledA,
  ul: Styled.ul,
  ol: Styled.ol,
  li: Styled.li,
};

export default ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
);
