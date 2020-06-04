import { useEffect, useState } from "react";
import { useApi, usePageVisibility } from "../../hooks";
import { Box, Button, Flex } from "@theme-ui/components";
import DeleteStreamModal from "../DeleteStreamModal";
import { Table, TableRow, TableRowVariant, Checkbox } from "../Table";
import { RelativeTime, StreamName, RenditionsDetails } from "../StreamsTable";
import { UserName } from "../AdminTokenTable";
import { Stream } from "@livepeer/api";

export default ({ id }: { id: string }) => {
  const [broadcasters, setBroadcasters] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [users, setUsers] = useState([]);
  const { getAdminStreams, deleteStream, getBroadcasters, getUsers } = useApi();
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
      .then(streams => setStreams(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [deleteModal]);
  const close = () => {
    setDeleteModal(false);
  };
  const isVisible = usePageVisibility();
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const interval = setInterval(() => {
      getAdminStreams()
        .then(streams => setStreams(streams))
        .catch(err => console.error(err)); // todo: surface this
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);
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
        <Button
          variant="outlineSmall"
          sx={{ margin: 2 }}
          onClick={() => {
            console.log("not implemented");
          }}
        >
          Create
        </Button>
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
          <Box>User name</Box>
          <Box>Name</Box>
          <Box>Details</Box>
          <Box>Segments</Box>
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
                <UserName id={stream.userId} users={users} />
                <StreamName stream={stream} />
                <RenditionsDetails stream={stream} />
                <Box>
                  {sourceSegments || 0}/{transcodedSegments || 0}
                </Box>
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
