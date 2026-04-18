const Avatar = ({ initials, bg, size = 36 }) => {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.33,
      flexShrink: 0,
      border: `2px solid #ffffff`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      {initials}
    </div>
  );
};

export default Avatar;