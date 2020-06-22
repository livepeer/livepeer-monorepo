import Link from "next/link";
import ReactTooltip from "react-tooltip";
import { useEffect, useState } from "react";
import { useApi, usePageVisibility } from "../../hooks";
import { Box, Button, Flex } from "@theme-ui/components";
import DeleteStreamModal from "../DeleteStreamModal";
import { Table, TableRow, TableRowVariant, Checkbox } from "../Table";
import Help from "../../public/img/help.svg";
import Modal from "../Modal";
import moment from "moment";
import { Stream } from "@livepeer/api";

type ProfileProps = {
  id: string;
  i: number;
  rendition: Rendition;
};

type Rendition = {
  width: number;
  name: string;
  height: number;
  bitrate: number;
  fps: number;
};

const Profile = ({
  id,
  i,
  rendition: { fps, name, width, height, bitrate }
}: ProfileProps) => {
  return (
    <Box
      id={`profile-${id}-${i}-${name}`}
      key={`profile-${id}-${i}-${name}`}
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

type RelativeTimeProps = {
  id: string;
  prefix: string;
  tm: number;
  swap?: boolean;
};

export const RelativeTime = ({
  id,
  prefix,
  tm,
  swap = false
}: RelativeTimeProps) => {
  const idpref = `time-${prefix}-${id}`;
  let main = moment.unix(tm / 1000.0).fromNow();
  let toolTip = moment.unix(tm / 1000.0).format("LLL");
  if (swap) {
    const s = main;
    main = toolTip;
    toolTip = s;
  }
  return (
    <Box id={idpref} key={idpref}>
      {tm ? (
        <>
          <ReactTooltip
            id={`tooltip-${idpref}`}
            className="tooltip"
            place="top"
            type="dark"
            effect="solid"
          >
            {toolTip}
          </ReactTooltip>
          <span data-tip data-for={`tooltip-${idpref}`}>
            {main}
          </span>
        </>
      ) : (
        <em>unseen</em>
      )}
    </Box>
  );
};

export const StreamName = ({
  stream,
  admin = false
}: {
  stream: Stream;
  admin?: boolean;
}) => {
  const pid = `stream-name-${stream.id}-${name}`;
  const query = admin ? { admin: true } : {};
  return (
    <Box>
      {stream.createdByTokenName ? (
        <ReactTooltip
          id={pid}
          className="tooltip"
          place="top"
          type="dark"
          effect="solid"
        >
          Created by token <b>{stream.createdByTokenName}</b>
        </ReactTooltip>
      ) : null}
      <Box data-tip data-for={pid}>
        <Link
          href={{ pathname: "/app/stream/[id]", query }}
          as={`/app/stream/${stream.id}`}
        >
          <a>{stream.name}</a>
        </Link>
      </Box>
    </Box>
  );
};

export const RenditionsDetails = ({ stream }: { stream: Stream }) => {
  let details = "";
  let detailsTooltip;
  if (stream.presets?.length) {
    details = `${stream.presets}`;
  }
  if (stream.profiles?.length) {
    if (details) {
      details += "/";
    }
    details += stream.profiles
      .map(({ height, fps }) => {
        if (fps === 0) {
          return `${height}pSourceFPS`;
        }
        return `${height}p${fps}`;
      })
      .join(",\u{200B}");
    detailsTooltip = (
      <Flex>
        {stream.profiles.map((p, i) => (
          <Profile key={i} id={stream.id} i={i} rendition={p} />
        ))}
      </Flex>
    );
    detailsTooltip = null; // remove for now, will be back later
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

export default ({ userId, id }: { userId: string; id: string }) => {
  const [broadcasters, setBroadcasters] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const { getStreams, deleteStream, getBroadcasters } = useApi();
  useEffect(() => {
    getBroadcasters()
      .then(broadcasters => setBroadcasters(broadcasters))
      .catch(err => console.error(err)); // todo: surface this
  }, []);
  useEffect(() => {
    getStreams(userId)
      .then(streams => setStreams(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId, deleteModal]);
  const close = () => {
    setDeleteModal(false);
    setSelectedStream(null);
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
    }, 5000);
    return () => clearInterval(interval);
  }, [userId, isVisible]);
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
        <DeleteStreamModal
          streamName={selectedStream.name}
          onClose={close}
          onDelete={() => {
            deleteStream(selectedStream.id).then(close);
          }}
        />
      )}
      <Box sx={{ mt: "2em" }}>
        <Link href="/app/stream/new-stream">
          <a>
            <Button variant="outlineSmall" sx={{ margin: 2 }}>
              Create
            </Button>
          </a>
        </Link>
        <Button
          variant="secondarySmall"
          aria-label="Delete Stream button"
          disabled={!selectedStream}
          sx={{ margin: 2, mb: 4 }}
          onClick={() => selectedStream && setDeleteModal(true)}
        >
          Delete
        </Button>
      </Box>
      <Table sx={{ gridTemplateColumns: "auto auto auto auto auto auto" }}>
        <TableRow variant={TableRowVariant.Header}>
          <Box></Box>
          <Box>Name</Box>
          <Box>Details</Box>
          <Box>Created</Box>
          <Box>Last Active</Box>
          <Box>Status</Box>
        </TableRow>
        {streams.map((stream: Stream) => {
          const {
            id,
            name,
            lastSeen,
            sourceSegments,
            transcodedSegments,
            createdAt,
            isActive
          } = stream;
          const selected = selectedStream && selectedStream.id === id;
          return (
            <>
              <TableRow
                key={id}
                variant={TableRowVariant.Normal}
                selected={selected}
                onClick={() => {
                  if (selected) {
                    setSelectedStream(null);
                  } else {
                    setSelectedStream(stream);
                  }
                }}
              >
                <Checkbox value={selected} />
                <StreamName stream={stream} />
                <RenditionsDetails stream={stream} />
                <RelativeTime
                  id={id}
                  prefix="createdat"
                  tm={createdAt}
                  swap={true}
                />
                <RelativeTime
                  id={id}
                  prefix="lastSeen"
                  tm={lastSeen}
                  swap={true}
                />
                <Box>{isActive ? "Active" : "Idle"}</Box>
              </TableRow>
            </>
          );
        })}
      </Table>
    </Box>
  );
};
