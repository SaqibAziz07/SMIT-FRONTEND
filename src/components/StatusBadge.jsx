const StatusBadge = ({ status }) => {
  const map = {
    active:   { bg: "#dcfce7", color: "#166534", label: "Active" },
    pending:  { bg: "#fef9c3", color: "#713f12", label: "Pending" },
    expired:  { bg: "#fee2e2", color: "#991b1b", label: "Expired" },
    draft:    { bg: "#f3f4f6", color: "#374151", label: "Draft" },
  };
  
  const s = map[status] || map.draft;
  
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 20,
      padding: "3px 10px",
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
};

export default StatusBadge;