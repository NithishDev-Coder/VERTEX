import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        padding: "40px",
        color: "black",
      }}
    >
      <h1>Vertex Virtual Lab</h1>

      <p>Welcome to Vertex Virtual Lab.</p>

      <Link to="/physics">
        <button>
          Open Physics Lab
        </button>
      </Link>
    </div>
  );
}