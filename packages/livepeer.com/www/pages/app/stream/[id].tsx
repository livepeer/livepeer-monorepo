import Link from "next/link";
import { Spinner, Box, Button, Flex, Heading } from "@theme-ui/components";
import Layout from "../../../components/Layout";
import useLoggedIn from "../../../hooks/use-logged-in";
import { Stream } from "@livepeer/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Copy from "../../../public/img/copy.svg";
import { useRouter } from "next/router";
import Router from "next/router";
import { useApi, usePageVisibility } from "../../../hooks";
import { useEffect, useState } from "react";
import TabbedLayout from "../../../components/TabbedLayout";
import StreamSessionsTable from "../../../components/StreamSessionsTable";
import DeleteStreamModal from "../../../components/DeleteStreamModal";
import { pathJoin } from "../../../lib/utils";
import {
  RelativeTime,
  RenditionsDetails
} from "../../../components/StreamsTable";
import { getTabs } from "../user";

type ShowURLProps = {
  text: string;
  url: string;
  anchor?: boolean;
  urlToCopy?: string;
};

const ShowURL = ({ text, url, urlToCopy, anchor = false }: ShowURLProps) => {
  const [isCopied, setCopied] = useState(0);
  useEffect(() => {
    if (isCopied) {
      const interval = setTimeout(() => {
        setCopied(0);
      }, isCopied);
      return () => clearTimeout(interval);
    }
  }, [isCopied]);
  const ccurl = urlToCopy ? urlToCopy : url;
  return (
    <Flex sx={{ justifyContent: "flex-start", alignItems: "center" }}>
      {text ? (
        <Box sx={{ minWidth: 125, fontSize: 12, paddingRight: "1em" }}>
          {text}:
        </Box>
      ) : null}
      <CopyToClipboard text={ccurl} onCopy={() => setCopied(2000)}>
        <Flex sx={{ alignItems: "center" }}>
          {anchor ? (
            <a
              sx={{ fontSize: 12, fontFamily: "monospace", mr: 1 }}
              href={url}
              target="_blank"
            >
              {url}
            </a>
          ) : (
            <span sx={{ fontSize: 12, fontFamily: "monospace", mr: 1 }}>
              {url}
            </span>
          )}
          <Copy
            sx={{
              mr: 1,
              cursor: "pointer",
              width: 14,
              height: 14,
              color: "listText"
            }}
          />
        </Flex>
      </CopyToClipboard>
      {!!isCopied && <Box sx={{ fontSize: 12, color: "listText" }}>Copied</Box>}
    </Flex>
  );
};

const Cell = ({ children }) => {
  return <Box sx={{ m: "0.4em" }}>{children}</Box>;
};

export default () => {
  useLoggedIn();
  const { user, logout, getStream, deleteStream, getIngest } = useApi();
  const router = useRouter();
  const { query, asPath } = router;
  const id = query.id;
  const [stream, setStream] = useState(null);
  const [ingest, setIngest] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getIngest()
      .then(ingest => setIngest(ingest))
      .catch(err => console.error(err)); // todo: surface this
  }, [id]);
  useEffect(() => {
    if (!id) {
      return;
    }
    getStream(id)
      .then(stream => setStream(stream))
      .catch(err => {
        if (err && err.status === 404) {
          setNotFound(true);
        }
        console.error(err);
      }); // todo: surface this
  }, [id]);
  const isVisible = usePageVisibility();
  useEffect(() => {
    if (!isVisible || !id || notFound) {
      return;
    }
    const interval = setInterval(() => {
      getStream(id)
        .then(stream => setStream(stream))
        .catch(err => console.error(err)); // todo: surface this
    }, 5000);
    return () => clearInterval(interval);
  }, [id, isVisible]);
  const [keyRevealed, setKeyRevealed] = useState(false);
  const close = () => {
    setDeleteModal(false);
  };

  if (!user || user.emailValid === false) {
    return <Layout />;
  }

  const getIngestURL = (stream: Stream, showKey: boolean): string => {
    const key = showKey ? stream.streamKey : "";
    return ingest.length ? pathJoin(ingest[0].ingest, key) : key || "";
  };
  const getPlaybackURL = (stream: Stream): string => {
    return ingest.length
      ? pathJoin(ingest[0].playback, `${stream.playbackId}/index.m3u8`)
      : stream.playbackId || "";
  };
  const tabs = getTabs(0);
  const backLink = query.admin ? "/app/admin/streams" : "/app/user";

  return (
    <TabbedLayout tabs={tabs} logout={logout}>
      {deleteModal && stream && (
        <DeleteStreamModal
          streamName={stream.name}
          onClose={close}
          onDelete={() => {
            deleteStream(stream.id).then(() => Router.replace("/app/user"));
          }}
        />
      )}
      <Box sx={{ my: "2em", maxWidth: 958, width: "100%", fontWeight: "bold" }}>
        <Link href={backLink}>
          <a>{"← stream list"}</a>
        </Link>
      </Box>
      {stream ? (
        <>
          <Flex
            sx={{
              justifyContent: "flex-start",
              alignItems: "baseline",
              maxWidth: 958,
              width: "100%",
              flexDirection: "column"
            }}
          >
            <Heading as="h3" sx={{ mb: "0.5em" }}>
              {stream.name}
            </Heading>
            <Box
              sx={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "10em auto",
                width: "100%",
                fontSize: 0
              }}
            >
              <Cell>Stream name</Cell>
              <Cell>{stream.name}</Cell>
              <Cell>Stream key</Cell>
              <Cell>
                {keyRevealed ? (
                  stream.streamKey
                ) : (
                  <Button
                    type="button"
                    variant="outlineSmall"
                    onClick={() => setKeyRevealed(true)}
                    sx={{ mr: 0, py: "4px", fontSize: 0 }}
                  >
                    Show secret stream key
                  </Button>
                )}
              </Cell>
              <Cell>RTMP ingest URL</Cell>
              <Cell>
                {keyRevealed ? (
                  <ShowURL
                    text=""
                    url={getIngestURL(stream, keyRevealed)}
                    urlToCopy={getIngestURL(stream, true)}
                    anchor={false}
                  />
                ) : (
                  <Flex
                    sx={{ justifyContent: "flex-start", alignItems: "center" }}
                  >
                    <Box
                      sx={{ minWidth: 125, fontSize: 12, paddingRight: "1em" }}
                    >
                      {getIngestURL(stream, false)}
                      <b>stream-key</b>
                      <i sx={{ ml: "2em" }}>
                        Reveal your stream key and the full URL via the button
                        above.
                      </i>
                    </Box>
                  </Flex>
                )}
              </Cell>
              <Cell>Playback URL</Cell>
              <Cell>
                <ShowURL text="" url={getPlaybackURL(stream)} anchor={true} />
              </Cell>
              <Cell>Renditions</Cell>
              <Cell>
                <RenditionsDetails stream={stream} />
              </Cell>
              <Cell>Created at</Cell>
              <Cell>
                <RelativeTime
                  id="cat"
                  prefix="createdat"
                  tm={stream.createdAt}
                  swap={true}
                />
              </Cell>
              <Cell>Last seen</Cell>
              <Cell>
                <RelativeTime
                  id="last"
                  prefix="lastSeen"
                  tm={stream.lastSeen}
                  swap={true}
                />
              </Cell>
              <Cell>Status</Cell>
              <Cell>{stream.isActive ? "Active" : "Idle"}</Cell>
              {user.admin ? (
                <>
                  <Cell>Deleted</Cell>
                  <Cell>{stream.deleted ? <strong>Yes</strong> : "No"}</Cell>
                </>
              ) : null}
            </Box>
          </Flex>
          <Flex
            sx={{
              mb: "2em",
              justifyContent: "flex-end",
              maxWidth: 958,
              width: "100%"
            }}
          >
            <Button
              type="button"
              variant="outlineSmall"
              onClick={() => setDeleteModal(true)}
              sx={{ mr: 0, py: "4px", fontSize: 0 }}
            >
              Delete
            </Button>
          </Flex>
          <StreamSessionsTable streamId={stream.id} />
        </>
      ) : notFound ? (
        <Box>Not found</Box>
      ) : (
        <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner sx={{ mr: "1em" }} />
          <div sx={{ color: "text" }}>Loading</div>
        </Flex>
      )}
    </TabbedLayout>
  );
};
