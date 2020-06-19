import { useEffect, useState } from "react";
import Link from "next/link";
import { useApi, usePageVisibility } from "../../hooks";
import { Box, Button, Flex } from "@theme-ui/components";
import DeleteStreamModal from "../DeleteStreamModal";
import { Table, TableRow, TableRowVariant, Checkbox } from "../Table";
import { RelativeTime, StreamName, RenditionsDetails } from "../StreamsTable";
import ReactTooltip from "react-tooltip";
import { UserName } from "../AdminTokenTable";
import { Stream } from "@livepeer/api";

const Segments = ({ stream }: { stream: Stream }) => {
  const idpref = `segments-${stream.id}`;
  return (
    <Box id={idpref} key={idpref}>
      <ReactTooltip
        id={`tooltip-${idpref}`}
        className="tooltip"
        place="top"
        type="dark"
        effect="solid"
      >
        Source segments / Transcoded segments
      </ReactTooltip>
      <span data-tip data-for={`tooltip-${idpref}`}>
        {stream.sourceSegments || 0}/{stream.transcodedSegments || 0}
      </span>
    </Box>
  );
};

const sortNameF = (a: Stream, b: Stream) =>
  ((a && a.name) || "").localeCompare((b && b.name) || "");

const sortUserIdF = (a: Stream, b: Stream) =>
  ((a && a.userId) || "").localeCompare((b && b.userId) || "");

const sortCreatedF = (a: Stream, b: Stream) =>
  (b.createdAt || 0) - (a.createdAt || 0);

const sortLastSeenF = (a: Stream, b: Stream) =>
  (b.lastSeen || 0) - (a.lastSeen || 0);

const sortActiveF = (a: Stream, b: Stream) => (+(b.isActive || false)) - +(a.isActive || false);

export default ({ id }: { id: string }) => {
  const [broadcasters, setBroadcasters] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [users, setUsers] = useState([]);
  const { getAdminStreams, deleteStream, getBroadcasters, getUsers } = useApi();
  const [sortFunc, setSortFunc] = useState(null);
  useEffect(() => {
    getUsers()
      .then(users => setUsers(users))
      .catch(err => console.error(err)); // todo: surface this
  }, []);
  useEffect(() => {
    getBroadcasters()
      .then(broadcasters => setBroadcasters(broadcasters))
      .catch(err => console.error(err)); // todo: surface this
  }, []);
  useEffect(() => {
    getAdminStreams()
      .then(streams => {
        if (sortFunc) {
          streams.sort(sortFunc);
        }
        setStreams(streams);
      })
      .catch(err => console.error(err)); // todo: surface this
  }, [deleteModal]);
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
      getAdminStreams()
        .then(streams => {
          console.log(`sort func:`, sortFunc);
          if (sortFunc) {
            streams.sort(sortFunc);
          }
          setStreams(streams);
        })
        .catch(err => console.error(err)); // todo: surface this
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible, sortFunc]);

  const sortUserId = () => {
    if (streams) {
      streams.sort(sortUserIdF);
      setSortFunc(() => sortUserIdF);
      setStreams([...streams]);
    }
  };
  const sortName = () => {
    if (streams) {
      streams.sort(sortNameF);
      setSortFunc(() => sortNameF);
      setStreams([...streams]);
    }
  };
  const sortCreated = () => {
    if (streams) {
      streams.sort(sortCreatedF);
      setSortFunc(() => sortCreatedF);
      setStreams([...streams]);
    }
  };
  const sortLastSeen = () => {
    if (streams) {
      streams.sort(sortLastSeenF);
      setSortFunc(() => sortLastSeenF);
      setStreams([...streams]);
    }
  };
  const sortActive = () => {
    if (streams) {
      streams.sort(sortActiveF);
      setSortFunc(() => sortActiveF);
      setStreams([...streams]);
    }
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
        <DeleteStreamModal
          streamName={selectedStream.name}
          onClose={close}
          onDelete={() => {
            deleteStream(selectedStream.id).then(close);
          }}
        />
      )}
      <Box sx={{ mt: "2em" }}>
        <Link
          href={{ pathname: "/app/stream/new-stream", query: { admin: true } }}
          as="/app/stream/new-stream"
        >
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
      <Table
        sx={{ gridTemplateColumns: "auto auto auto auto auto auto auto auto" }}
      >
        <TableRow variant={TableRowVariant.Header}>
          <Box></Box>
          <Box
            sx={{
              cursor: "pointer"
            }}
            onClick={sortUserId}
          
          >User name</Box>
          <Box
            sx={{
              cursor: "pointer"
            }}
            onClick={sortName}
          >
            Name
          </Box>
          <Box>Details</Box>
          <Box>Segments</Box>
          <Box
            sx={{
              cursor: "pointer"
            }}
            onClick={sortCreated}
          >
            Created
          </Box>
          <Box
            sx={{
              cursor: "pointer"
            }}
            onClick={sortLastSeen}
          >
            Last Active
          </Box>
          <Box
            sx={{
              cursor: "pointer"
            }}
            onClick={sortActive}
          >
            Status
          </Box>
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
                <UserName id={stream.userId} users={users} />
                <StreamName stream={stream} admin={true} />
                <RenditionsDetails stream={stream} />
                <Segments stream={stream} />
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
