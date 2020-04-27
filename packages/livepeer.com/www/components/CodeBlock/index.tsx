// src/CodeBlock.js
import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { Styled } from "theme-ui";

export default ({ children, className }) => {
  let language = null;
  if (className && className.startsWith("language-")) {
    language = className.replace("language-", "");
  }
  return (
    <Highlight
      {...defaultProps}
      code={children}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre className={className} style={{ ...style, padding: "20px" }}>
          {tokens.map((line, i) => {
            // Workaround for MDX rendering trailing lines on everything
            const lastLine = i === tokens.length - 1;
            return (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => {
                  if (lastLine && token.empty) {
                    return null;
                  }
                  return <span key={key} {...getTokenProps({ token, key })} />;
                })}
              </div>
            );
          })}
        </Styled.pre>
      )}
    </Highlight>
  );
};
