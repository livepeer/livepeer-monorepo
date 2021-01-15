const Index = ({ children, ...props }) => (
  <div
    {...props}
    sx={{
      border: "1px solid",
      borderRadius: 2,
      borderColor: "muted",
      px: 1,
      py: "4px",
      fontSize: 12,
    }}>
    {children}
  </div>
);

export default Index;
