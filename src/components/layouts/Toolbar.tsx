export default function Toolbar() {
  return (
    <div
      style={{
        height: "60px",
        background: "#1e293b",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "20px",
      }}
    >
      <h2>Vertex Physics Lab</h2>

      <button>Select</button>
      <button>Edit</button>
      <button>Run</button>
    </div>
  );
}