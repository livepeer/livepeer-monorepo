import { useState } from "react";
import { Box } from "@theme-ui/components";

export default ({
  disabled = false,
  onFocus = null,
  onBlur = null,
  type = "text",
  error = false,
  autoFocus = false,
  required = false,
  messageFixed = false,
  messageColor = "text",
  defaultValue = undefined,
  value = undefined,
  inputRef = undefined,
  onChange = null,
  message = null,
  as = "input",
  rows = 2,
  name = "",
  htmlFor = "",
  id = "",
  label,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [scopedValue, setScopedValue] = useState("");

  return (
    <Box
      sx={{
        bg: "#F4F4F4",
        border: "0",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        margin: "0",
        display: "inline-flex",
        padding: "0",
        position: "relative",
        minWidth: "0",
        flexDirection: "column",
        verticalAlign: "top"
      }}
      {...props}
    >
      <Box
        as="label"
        sx={{
          zIndex: "1",
          transform:
            defaultValue || value || scopedValue || focused
              ? "translate(20px, 18px) scale(0.75)"
              : "translate(20px, 28px) scale(1)",
          pointerEvents: "none",
          top: "0",
          left: "0",
          position: "absolute",
          transition:
            "color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
          display: "block",
          transformOrigin: "top left",
          color: "#6f6f6f",
          padding: 0,
          fontSize: 20,
          lineHeight: 1
        }}
        htmlFor={htmlFor}
        id={id}
      >
        {label}
      </Box>
      <Box
        sx={{
          transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
          backgroundColor: "rgba(255, 255, 255, 0.09)",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          color: "text",
          cursor: "text",
          display: "inline-flex",
          position: "relative",
          fontSize: "1rem",
          boxSizing: "border-box",
          alignItems: "center",
          lineHeight: "1.1875em",
          "&:before": {
            left: "0",
            right: "0",
            bottom: "0",
            content: '"\\00a0"',
            position: "absolute",
            transition:
              "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            borderBottom: "1px solid",
            borderColor: error ? "red" : "text",
            pointerEvents: "none"
          },
          "&:after": {
            left: "0",
            right: "0",
            bottom: "0",
            content: '""',
            position: "absolute",
            transform: "scaleX(0)",
            transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
            borderBottom: "2px solid",
            borderColor: error ? "red" : "text",
            pointerEvents: "none"
          }
        }}
      >
        <Box
          as={as ? as : "input"}
          rows={rows}
          onFocus={onFocus ? onFocus : () => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? onChange : e => setScopedValue(e.target.value)}
          ref={inputRef}
          name={name}
          sx={{
            padding: "40px 20px 16px",
            fontSize: 20,
            color: "currentColor",
            width: "100%",
            border: "0",
            margin: "0",
            display: "block",
            minWidth: "0",
            background: "none",
            boxSizing: "content-box",
            animationName: "MuiInputBase-keyframes-auto-fill-cancel",
            WebkitTapHighlightColor: "transparent"
          }}
          id={id}
          type={type}
        />
      </Box>
      {(messageFixed || message) && (
        <Box
          sx={{
            height: 16,
            color: error ? "red" : messageColor,
            pt: "6px",
            pl: "12px",
            fontSize: 0
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};
