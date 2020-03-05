import { Flex } from "@theme-ui/components";
import {
  FaReddit,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaDiscord,
  FaDiscourse,
  FaMedium
} from "react-icons/fa";

export default ({ ...props }) => {
  return (
    <Flex {...props}>
      <a
        href="https://reddit.com/r/livepeer"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaReddit sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://twitter.com/LivepeerOrg"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaTwitter sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://www.youtube.com/channel/UCzfHtZnmUzMbJDxGCwIgY2g"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaYoutube sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://github.com/livepeer"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaGithub sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://discord.gg/TTUQqK"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaDiscord sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://forum.livepeer.org"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaDiscourse sx={{ mr: 3, color: "white" }} />
      </a>
      <a
        href="https://medium.com/livepeer-blog"
        target="__blank"
        rel="noopener noreferrer"
      >
        <FaMedium sx={{ color: "white" }} />
      </a>
    </Flex>
  );
};
