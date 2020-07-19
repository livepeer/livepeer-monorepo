/** @jsx jsx */
import { Input, Box } from "@theme-ui/components";
import CopyBoxIcon from "./CopyBoxIcon";
import { useRef, MutableRefObject } from "react";

export default ({ copy, onCopy = () => {} }) => {
  const inputRef: MutableRefObject<HTMLInputElement> = useRef();
  return (
    <Box
      onClick={async () => {
        await navigator.clipboard.writeText(copy);
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
        onCopy();
      }}
      sx={{
        position: "relative",
        display: "grid",
        alignItems: "center",
        justifyItems: "flex-end",
        cursor: "pointer"
      }}
    >
      <Input
        value={copy}
        spellCheck={false}
        ref={inputRef}
        onClick={e => {
          e.target.focus();
          e.target.select();
        }}
        sx={{
          fontFamily: "monospace",
          px: 2,
          width: "400px",
          cursor: "text",
          // We need to be able to select it but not edit it; this hides the focus effect
          "&:focus": {
            outline: "none"
          }
        }}
        readOnly="readOnly"
      />
      <CopyBoxIcon sx={{ position: "absolute", marginRight: 2 }} />
    </Box>
  );
};
