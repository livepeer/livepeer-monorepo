import useApi from "../../../hooks/use-api";
import { Box, Grid, Link } from "@theme-ui/components";
import { useState } from "react";
import Layout from "../../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";
import useLoggedIn from "../../../hooks/use-logged-in";
import { useRouter } from "next/router";
import { Input } from "@theme-ui/components";

export default () => {
  useLoggedIn();
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [streamName, setStreamName] = useState("");
  const { user, createStream } = useApi();

  if (!user || user.emailValid === false) {
    return <Layout />;
  }

  return (
    <Layout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 958,
          mb: [3, 3],
          mx: "auto"
        }}
      >
        <Box sx={{ my: "2em", maxWidth: 958, width: "100%", fontWeight: "bold" }}>
          <Link href="/app/user">
            <a>{"← stream list"}</a>
          </Link>
        </Box>
        <p>
          <strong>Create a new stream</strong>
        </p>
        <form
          id={"New Stream"}
          onSubmit={e => {
            e.preventDefault();
            if (creating) {
              return;
            }
            setCreating(true);
            createStream({
              name: streamName,
              profiles: [{
                "name": "240p0",
                "fps": 0,
                "bitrate": 250000,
                "width": 426,
                "height": 240
              }, {
                "name": "360p0",
                "fps": 0,
                "bitrate": 800000,
                "width": 640,
                "height": 360
              }, {
                "name": "480p0",
                "fps": 0,
                "bitrate": 1600000,
                "width": 854,
                "height": 480
              }, {
                "name": "720p0",
                "fps": 0,
                "bitrate": 3000000,
                "width": 1280,
                "height": 720
              }]
            })
              .then(newStream => {
                setCreating(false);
                router.replace(`/app/stream/${newStream.id}`);
              })
              .catch(e => {
                setCreating(false);
              });
          }}
        >
          <Grid
            gap={2}
            columns={[3, "1fr 3fr 3fr"]}
            sx={{
              alignItems: "center"
            }}
          >
            <Box>Stream name</Box>
            <Box>
              <Input
                label="Stream name"
                value={streamName}
                sx={{
                  border: "white",
                  borderBottom: "2px solid black",
                  borderRadius: "0px"
                }}
                onChange={e => setStreamName(e.target.value)}
                placeholder="new-stream-name-123"
              ></Input>
            </Box>
            <Box>(a-z, A-Z, 0-9, -, _, ~ only)</Box>
          </Grid>
          <Flex sx={{ justifyContent: "flex-beginning", py: 3 }}>
            <Button type="submit" variant="outlineSmall">
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};
