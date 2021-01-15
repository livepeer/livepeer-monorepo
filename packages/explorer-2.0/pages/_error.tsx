import { Flex, Box } from "@theme-ui/components";

const statusCodes: { [code: number]: string } = {
  400: "Bad Request",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

function Error({ statusCode }) {
  return (
    <Flex
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bg: "background",
      }}>
      <Box
        sx={{
          fontSize: 5,
          pr: 3,
          mr: 3,
          borderRight: "1px solid",
          borderColor: "white",
        }}>
        {statusCode}
      </Box>
      <p>{statusCodes[statusCode]}</p>
    </Flex>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
