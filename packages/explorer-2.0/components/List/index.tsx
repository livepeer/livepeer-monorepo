import Box from "../Box";

interface Props {
  css?: object;
  onScroll?: React.UIEventHandler;
  header?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
}

const Index = ({
  css = {},
  header = null,
  onScroll,
  children,
  ...props
}: Props) => (
  <Box onScroll={onScroll} css={{ width: "100%", ...css }} {...props}>
    {header && (
      <Box
        css={{ pb: "$3", borderBottom: "1px solid", borderColor: "$border" }}
      >
        {header}
      </Box>
    )}
    <Box>{children}</Box>
  </Box>
);

export default Index;
