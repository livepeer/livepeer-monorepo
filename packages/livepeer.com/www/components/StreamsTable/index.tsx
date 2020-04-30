import { useEffect, useState } from "react";
import { useApi } from "../../hooks";
import { Box } from "@theme-ui/components";
import { Table, TableRow } from "../Table";
import moment from 'moment'

export default ({ userId, id }) => {
  const [streams, setStreams] = useState([]);
  const { getStreams } = useApi();
  useEffect(() => {
    getStreams(userId)
      .then(streams => setStreams(streams))
      .catch(err => console.error(err)); // todo: surface this
  }, [userId]);
  useEffect(() => {
    const interval = setInterval(() => {
      getStreams(userId)
        .then(streams => setStreams(streams))
        .catch(err => console.error(err)); // todo: surface this
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto"
      }}
    >
      <p>
        Streams:
      </p>
      {streams.length === 0 ?
      (<p>No streams created yet</p>) : (
      <Table sx={{ gridTemplateColumns: "auto 1fr auto auto auto" }}>
        <TableRow variant="header">
          <Box>ID</Box>
          <Box>Name</Box>
          <Box>Details</Box>
          <Box>Segments</Box>
          <Box>Last Active</Box>
        </TableRow>
        {
          streams.map(stream => {
            const { id, name, lastSeen, sourceSegments, transcodedSegments,
              presets, renditions } = stream;
            let formattedLastSeen = <em>unseen</em>;
            if (lastSeen) {
              formattedLastSeen = (
                <span>{
                  moment
                    .unix(lastSeen / 1000.0)
                    .fromNow()}
                </span>
              );
            }
            let details = ''
            if (presets?.length) {
              details = `${presets}`
            }
            if (Object.keys(renditions||{}).length) {
              if (details) {
                details += '/'
              }
              details += `${renditions}`
            }
            return (
              <TableRow key={id} >
                <Box>{id}</Box>
                <Box>{name}</Box>
                <Box>{details}</Box>
                <Box><span>{sourceSegments || 0}/{transcodedSegments || 0}</span></Box>
                <Box>{formattedLastSeen}</Box>
              </TableRow>
            );
          })}
      </Table>
      )}
    </Box>
  );
};
