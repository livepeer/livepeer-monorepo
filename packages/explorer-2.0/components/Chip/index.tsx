const Index = ({ label, ...props }) => (
  <div
    sx={{
      borderRadius: 1000,
      bg: "rgba(255,255,255,.08)",
      px: 2,
      py: "4px",
      display: "inline-flex",
      fontSize: 0,
      fontWeight: 600,
      ...props.sx,
    }}>
    {label}
  </div>
);

export default Index;
