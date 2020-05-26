import { useEffect, useState } from "react";
import { useApi, usePageVisibility } from "../../hooks";
import { Box, Button, IconButton, Flex } from "@theme-ui/components";
import { Table, TableRow, TableRowVariant } from "../Table";
import Modal from "../Modal";
import moment from "moment";
import { Stream } from "@livepeer/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Copy from "../../public/img/copy.svg";
import ReactTooltip from "react-tooltip";
import Help from "../../public/img/help.svg";

const Profile = (
  id: string,
  i: number,
  { fps, name, width, height, bitrate }
) => {
  return (
    <Box
      id={`profile-${id}-${i}-${name}`}
      sx={{
        padding: "0.5em",
        display: "grid",
        alignItems: "space-around",
        gridTemplateColumns: "auto auto"
      }}
    >
      <Box>name:</Box>
      <Box>{name}</Box>
      <Box>fps:</Box>
      <Box>{fps}</Box>
      <Box>width:</Box>
      <Box>{width}</Box>
      <Box>height:</Box>
      <Box>{height}</Box>
      <Box>bitrate:</Box>
      <Box>{bitrate}</Box>
    </Box>
  );
};

const RelativeTime = ({ id, prefix, tm }) => {
  const idpref = `time-${prefix}-${id}`;
  return (
    <Box id={idpref}>
      {tm ? (
        <>
          <ReactTooltip
            id={`tooltip-${idpref}`}
            className="tooltip"
            place="top"
            type="dark"
            effect="solid"
          >
            {moment.unix(tm / 1000.0).format()}
          </ReactTooltip>
          <span data-tip data-for={`tooltip-${idpref}`}>
            {moment.unix(tm / 1000.0).fromNow()}
          </span>
        </>
      ) : (
        <em>unseen</em>
      )}
    </Box>
  );
};

const StreamName = ({ stream }: { stream: Stream }) => {
  const pid = `stream-name-${stream.id}-${name}`;
  return (
    <Box>
      {stream.createdByTokenName ? ( <ReactTooltip
            id={pid}
            className="tooltip"
            place="top"
            type="dark"
            effect="solid"
          >
            Created by token <b>{stream.createdByTokenName}</b>
          </ReactTooltip>
      ): null}
      <span data-tip data-for={pid}>
        {stream.name}
      </span>
    </Box>
  );
};

const RenditionsDetails = ({ stream }: { stream: Stream }) => {
  let details = "";
  let detailsTooltip;
  if (stream.presets?.length) {
    details = `${stream.presets}`;
  }
  if (stream.profiles?.length) {
    if (details) {
      details += "/";
    }
    details += stream.profiles.map(({ name }) => name).join(",");
    detailsTooltip = (
      <Flex>{stream.profiles.map((p, i) => Profile(stream.id, i, p))}</Flex>
    );
  }
  return (
    <Flex>
      <Box>{details}</Box>
      {detailsTooltip ? (
        <Flex sx={{ alignItems: "center" }}>
          <Flex>
            <ReactTooltip
              id={`tooltip-details-${stream.id}`}
              className="tooltip"
              place="top"
              type="dark"
              effect="solid"
            >
              {detailsTooltip}
            </ReactTooltip>
            <Help
              data-tip
              data-for={`tooltip-details-${stream.id}`}
              sx={{
                color: "muted",
                cursor: "pointer",
                ml: 1
              }}
            />
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};

const ShowURL = ({ text, url }: { text: string; url: string }) => {
  const [isCopied, setCopied] = useState(0);
  useEffect(() => {
    if (isCopied) {
      const interval = setTimeout(() => {
        setCopied(0);
      }, isCopied);
      return () => clearTimeout(interval);
    }
  }, [isCopied]);
  return (
    <Flex sx={{ justifyContent: "flex-start", alignItems: "center" }}>
      <Box sx={{ minWidth: 125, fontSize: 12, paddingRight: "1em" }}>
        {text}:
      </Box>
      <CopyToClipboard text={url} onCopy={() => setCopied(2000)}>
        <Flex sx={{ alignItems: "center" }}>
          <span sx={{ fontSize: 12, fontFamily: "monospace", mr: 1 }}>
            {url}
          </span>
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

export default ({ userId, id }) => {
  const [broadcasters, setBroadcasters] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [streamsSessions, setStreamsSessions] = useState([]);
  const {
    getStreams,
    deleteStream,
    getBroadcasters,
    getStreamSessions
  } = useApi();
  useEffect(() => {
    getBroadcasters()
      .then(broadcasters => setBroadcasters(broadcasters))
      .catch(err => console.error(err)); // todo: surface this
  }, []);
  useEffect(() => {
    getStreams(userId)
      .then(streams => setStreams(streams))
      .catch(err => console.error(err)); // todo: surface this
    getStreamSessions(userId)
      .then(streams => setStreamsSessions(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId, deleteModal]);
  const close = () => {
    setDeleteModal(false);
  };
  const isVisible = usePageVisibility();
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const interval = setInterval(() => {
      getStreams(userId)
        .then(streams => setStreams(streams))
        .catch(err => console.error(err)); // todo: surface this
      getStreamSessions(userId)
        .then(streams => setStreamsSessions(streams))
        .catch(err => console.error(err)); // todo: surface this
    }, 5000);
    return () => clearInterval(interval);
  }, [userId, isVisible]);
  const getIngestURL = (stream: Stream): string => {
    return broadcasters?.length && stream.streamKey
      ? `${broadcasters[0].address
          .replace("http:", "rtmp:")
          .replace(":8935", "")}/live/${stream.streamKey}`
      : stream.streamKey || "";
  };
  const getPlaybackURL = (stream: Stream): string => {
    return broadcasters?.length && stream.playbackId
      ? `${broadcasters[0].address}/hls/${stream.playbackId}/index.m3u8`
      : stream.playbackId || "";
  };
  const getParentName = (stream: Stream): string => {
    let parent;
    if (streams.length && stream.parentId) {
      parent = streams.find(s => s.id === stream.parentId);
    }
    return parent ? parent.name : stream.name;
  };
  return (
    <Box
      id={id}
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      {deleteModal && selectedStream && (
        <Modal onClose={close}>
          <h3>Delete stream</h3>
          <p>Are you sure you want to delete stream "{selectedStream.name}"?</p>
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
                deleteStream(selectedStream.id).then(close);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Modal>
      )}
      <p>
        <strong>Streams:</strong>
      </p>
      {streams.length === 0 ? (
        <p>No streams created yet</p>
      ) : (
        <Table sx={{ gridTemplateColumns: "auto auto auto auto auto auto" }}>
          <TableRow variant={TableRowVariant.Header}>
            <Box></Box>
            <Box>Name</Box>
            <Box>Details</Box>
            <Box>Segments</Box>
            <Box>Created</Box>
            <Box>Last Active</Box>
          </TableRow>
          {streams.map((stream: Stream) => {
            const {
              id,
              name,
              lastSeen,
              sourceSegments,
              transcodedSegments,
              createdAt
            } = stream;
            return (
              <>
                <TableRow
                  selectable={false}
                  key={id}
                  variant={TableRowVariant.ComplexTop}
                >
                  <Box>
                    <IconButton
                      aria-label="Delete stream"
                      onClick={() => {
                        setSelectedStream(stream);
                        setDeleteModal(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentcolor"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </IconButton>
                  </Box>
                  <StreamName stream={stream} />
                  <RenditionsDetails stream={stream} />
                  <Box>
                    {sourceSegments || 0}/{transcodedSegments || 0}
                  </Box>
                  <RelativeTime id={id} prefix="createdat" tm={createdAt} />
                  <RelativeTime id={id} prefix="lastSeen" tm={lastSeen} />
                </TableRow>
                <TableRow
                  selectable={false}
                  variant={TableRowVariant.ComplexMiddle}
                  sx1={{ gridColumnEnd: "span 6" }}
                >
                  <ShowURL text="Ingest URL" url={getIngestURL(stream)} />
                </TableRow>
                <TableRow
                  selectable={false}
                  variant={TableRowVariant.ComplexBottom}
                  sx1={{ gridColumnEnd: "span 6" }}
                >
                  <ShowURL text="Playback URL" url={getPlaybackURL(stream)} />
                </TableRow>
              </>
            );
          })}
        </Table>
      )}
      <p>
        <strong>Stream Sessions:</strong>
      </p>
      {streamsSessions.length === 0 ? (
        <p>No streams stream yet</p>
      ) : (
        <Table sx={{ gridTemplateColumns: "auto auto auto auto auto" }}>
          <TableRow variant={TableRowVariant.Header}>
            <Box>Name</Box>
            <Box>Details</Box>
            <Box>Segments</Box>
            <Box>Created</Box>
            <Box>Last Active</Box>
          </TableRow>
          {streamsSessions.map(stream => {
            const {
              id,
              lastSeen,
              createdAt,
              sourceSegments,
              transcodedSegments
            } = stream;
            return (
              <TableRow key={id}>
                <Box>{getParentName(stream)}</Box>
                <RenditionsDetails stream={stream} />
                <Box>
                  {sourceSegments || 0}/{transcodedSegments || 0}
                </Box>
                <RelativeTime id={id} prefix="createdat" tm={createdAt} />
                <RelativeTime id={id} prefix="lastSeen" tm={lastSeen} />
              </TableRow>
            );
          })}
        </Table>
      )}
    </Box>
  );
};
