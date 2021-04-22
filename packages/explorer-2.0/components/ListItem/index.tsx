import Flex from "../Flex";

const Index = ({ css = {}, avatar = null, children, ...props }) => {
  return (
    <Flex
      css={{
        borderTop: "1px solid",
        borderColor: "$border",
        py: "$3",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        "&:first-of-type": {
          borderTop: 0,
        },
        ...css,
      }}
      {...props}>
      <Flex css={{ width: "100%", alignItems: "center" }}>
        {/* {avatar} */}
        {children}
      </Flex>
    </Flex>
  );
};

export default Index;
