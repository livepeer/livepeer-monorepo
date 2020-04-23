import ReactMarkdown from "react-markdown";
import { Box, Flex } from "@theme-ui/components";
import { Styled } from "theme-ui";
import { Fragment } from "react";

const renderers = {
  code: ({ language, value, children }) => {
    return (
      <Fragment>
        <Styled.pre>
          <Styled.code>{value}</Styled.code>
        </Styled.pre>
        <Box></Box>
      </Fragment>
    );
  }
};

export default ({ markdown }) => {
  return (
    <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
      <Box
        sx={{
          maxWidth: 958,
          padding: 3
        }}
      >
        <ReactMarkdown renderers={renderers}>{markdown}</ReactMarkdown>
      </Box>
    </Flex>
  );
};
