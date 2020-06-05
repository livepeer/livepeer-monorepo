import useApi from "../../../hooks/use-api";
import { Box, Grid, Link } from "@theme-ui/components";
import Arrow from "./Arrow.svg";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Button } from "@theme-ui/components";
import { Flex } from "@theme-ui/components";
import useLoggedIn from "../../../hooks/use-logged-in";
import Modal from "../../../components/Modal";
import { useRouter } from "next/router";
import { useRef, MutableRefObject } from "react";

export default () => {
  useLoggedIn();
  const inputRef: MutableRefObject<HTMLInputElement> = useRef();
  const [showKey, setShowKey] = useState(null);
  const { user, deleteStream, getStream } = useApi();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [createdDate, setCreatedDate] = useState("");
  const [stream, setStream] = useState(null);
  const [copy, setCopy] = useState(null);
  const [error, setError] = useState(null);

  const { streamId } = router.query;

  useEffect(() => {
    if (!streamId) {
      return;
    }
    setError(null);
    getStream(streamId)
      .then(stream => {
        setStream(stream);
        setCreatedDate(formatDate(stream));
      })
      .catch(e => {
        setError(e);
      });
  }, [streamId, createdDate]);

  const onSetShowKey = () => {
    if (showKey) {
      setShowKey(null);
      setCopy(null);
    } else {
      setShowKey(true);
      setCopy(true);
    }
  };

  const close = () => {
    setDeleteModal(false);
    setShowKey(null);
  };

  const formatDate = stream => {
    const d = new Date(stream.createdAt);
    const formattedDate =
      d.getMonth() +
      1 +
      "/" +
      d.getDate() +
      "/" +
      d.getFullYear() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes();
    return formattedDate;
  };

  if (error) {
    return (
      <Layout subnav={true}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 958,
            mb: [3, 3],
            mx: "auto"
          }}
        >
          <p>{`${error}`}</p>
        </Box>
      </Layout>
    );
  }

  if (!stream || stream.deleted == true) {
    return <Layout subnav={true} />;
  }

  if (!user || user.emailValid === false) {
    return <Layout subnav={true} />;
  }

  return (
    <Layout subnav={true}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 958,
          mb: [3, 3],
          mx: "auto"
        }}
      >
        {deleteModal && (
          <Modal onClose={close}>
            <h3>Are you sure?</h3>
            <p>Deleting a stream cannot be undone.</p>
            <Flex sx={{ justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="outlineSmall"
                onClick={close}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondarySmall"
                onClick={() => {
                  deleteStream(streamId).then(router.replace(`/app/stream`));
                }}
              >
                Delete
              </Button>
            </Flex>
          </Modal>
        )}
        <Link
          href="/app/stream"
          sx={{
            textDecoration: "none"
          }}
        >
          <a>
            <Arrow sx={{ mb: 3 }} />
          </a>
        </Link>
        <p>
          <strong>{stream.name}</strong>
        </p>
        <Grid gap={2} columns={[3, "2fr 4fr 3.5fr"]}>
          <Box>Stream name</Box>
          <Box>{stream.name}</Box>
          <Box></Box>
          <Box>{"Stream key"}</Box>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(stream.id);
              if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
              }
              console.log(`hi: ${showKey}`);
              onSetShowKey();
            }}
            variant="outlineSmall"
            sx={{
              width: "400px",
              height: "40px"
            }}
          >
            {showKey && stream.id}
            {!showKey && "Show & Copy Secret Stream Key"}
          </Button>
          <Box sx={{ fontStyle: "italic" }}>{copy && "Copied!"}</Box>
          <Box>RTMP ingest URL </Box>
          <Box>{"TBD"}</Box>
          <Box></Box>
          <Box>Playback URL</Box>
          <Box>{"TBD"}</Box>
          <Box></Box>
          <Box>Renditions</Box>
          <Box>{"TBD. Fixed for all."}</Box>
          <Box></Box>
          <Box>Created at</Box>

          <Box>{createdDate}</Box>
          <Box></Box>
          <Box>Last seen at</Box>
          <Box>{"Ping /status endpoint?"}</Box>
          <Box></Box>
          <Box>Status</Box>
          <Box>{"Ping /status endpoint?"}</Box>
          <Box></Box>
        </Grid>
      </Box>
      <Flex sx={{ justifyContent: "flex-end", py: 3, px: 5 }}>
        <Button
          variant="secondarySmall"
          sx={{ margin: 2, mb: 4 }}
          onClick={() => setDeleteModal(true)}
        >
          Delete
        </Button>
      </Flex>
    </Layout>
  );
};
