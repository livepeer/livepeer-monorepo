import { Flex } from "theme-ui";
import { Box } from "theme-ui";

const Index = ({ ...props }) => {
  return (
    <Flex
      sx={{
        borderTop: "1px solid",
        borderColor: "border",
        py: 2,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        "&:first-of-type": {
          borderTop: 0,
        },
      }}
      {...props}>
      <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
        <Box>
          <Box>
            Title <span>(LIP-16)</span>
          </Box>
          <Box>Voting ends on April 10th, 2020</Box>
        </Box>
        <Box>Active</Box>
      </Flex>
      <Box>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi.
      </Box>
    </Flex>
  );
};

export default Index;
