import { Flex, Container } from "@theme-ui/components";
import TeamMember from "../TeamMember";

export default ({ teamMembers }) => {
  return (
    <Container>
      <Flex
        sx={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "stretch",
          flexWrap: "wrap"
        }}
      >
        {teamMembers.map((t, i) => (
          <TeamMember
            key={i}
            fullname={t.fullname}
            role={t.role}
            image={t.image}
            twitter={t.twitter}
            linkedin={t.linkedin}
            github={t.github}
            medium={t.medium}
            sx={{ flex: "1 1 25%" }}
          />
        ))}
      </Flex>
    </Container>
  );
};
