import { useEffect, useState } from "react";
import { useApi } from "../../hooks";
import { Box, Button, Flex, Input } from "@theme-ui/components";
import { Table, TableRow, Checkbox } from "../Table";
import moment from "moment";
import Modal from "../Modal";
import { Link } from "@theme-ui/components";

export default ({ userId, id }) => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const { getStreams, deleteStream } = useApi();
  useEffect(() => {
    getStreams(userId)
      .then(streams => setStreams(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId, deleteModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      getStreams(userId)
        .then(streams => setStreams(streams))
        .catch(err => console.error(err)); // todo: surface this
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const close = () => {
    setDeleteModal(false);
    setSelectedStream(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      {deleteModal && selectedStream && (
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
                deleteStream(selectedStream.id).then(close);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Modal>
      )}
      <Link href="/app/stream/new-stream">
        <a>
          <Button variant="outlineSmall" sx={{ margin: 2 }}>
            Create
          </Button>
        </a>
      </Link>
      <Button
        variant="secondarySmall"
        disabled={!selectedStream}
        sx={{ margin: 2, mb: 4 }}
        onClick={() => selectedStream && setDeleteModal(true)}
      >
        Delete
      </Button>
      {streams.length === 0 ? (
        <p>No streams created yet</p>
      ) : (
        <Table sx={{ gridTemplateColumns: "auto auto 1fr auto auto auto" }}>
          <TableRow variant="header">
            <Box></Box>
            <Box>ID</Box>
            <Box>Name</Box>
            <Box>Details</Box>
            <Box>Segments</Box>
            <Box>Last Active</Box>
          </TableRow>
          {streams.map(stream => {
            const {
              id,
              name,
              lastSeen,
              sourceSegments,
              transcodedSegments,
              presets,
              renditions
            } = stream;
            let formattedLastSeen = <em>unseen</em>;
            if (lastSeen) {
              formattedLastSeen = (
                <span>{moment.unix(lastSeen / 1000.0).fromNow()}</span>
              );
            }
            let details = "";
            if (presets?.length) {
              details = `${presets}`;
            }
            if (Object.keys(renditions || {}).length) {
              if (details) {
                details += "/";
              }
              details += `${renditions}`;
            }
            const selected = selectedStream && selectedStream.id === id;
            return (
              <TableRow
                selected={selected}
                key={id}
                onClick={() => {
                  if (selected) {
                    setSelectedStream(null);
                  } else {
                    setSelectedStream(stream);
                  }
                }}
              >
                <Checkbox value={selected} />
                <Box>{id}</Box>
                <Box>{name}</Box>
                <Box>{details}</Box>
                <Box>
                  <span>
                    {sourceSegments || 0}/{transcodedSegments || 0}
                  </span>
                </Box>
                <Box>{formattedLastSeen}</Box>
              </TableRow>
            );
          })}
        </Table>
      )}
    </Box>
  );
};
