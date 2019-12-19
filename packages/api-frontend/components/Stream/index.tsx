/** @jsx jsx */
import { Box, Styled, jsx } from "theme-ui";
import { useEffect, useState } from "react";

export default ({ id }) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    setStream(null);
    if (!id) {
      return;
    }
    let url;
    if (id.startsWith("http")) {
      url = id;
    } else {
      url = "/api/stream/";
    }
    const googleAuthToken = localStorage.getItem("googleAuthToken");
    fetch(url, {
      headers: { authorization: googleAuthToken }
    })
      .then(res => res.json())
      .then(setStream);
  }, [id]);

  if (!stream) {
    return <Box></Box>;
  }

  return (
    <Box>
      <h3>{stream.id}</h3>
      <h4>Profiles</h4>
      {stream.profiles.map(profile => (
        <p key={profile.name}>
          Name: {profile.name} <br />
          Resolution: {profile.width}x{profile.height} <br />
          Bitrate: {profile.bitrate} bps <br />
          FPS: {profile.fps}
        </p>
      ))}
    </Box>
  );
};
