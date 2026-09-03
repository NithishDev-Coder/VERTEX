import { useUIStore } from "../../stores/uiStore";

interface PropertyPanelProps {
  position: [number, number, number];
  size: [number, number, number];
}

export default function PropertyPanel({
  position,
  size,
}: PropertyPanelProps) {
  const selectedObject = useUIStore(
    (state) => state.selectedObject
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 250,
        padding: 20,
        background: "white",
        borderRadius: 10,
      }}
    >
      <h2 style={{ color: "black" }}>
        Object Properties
      </h2>

      {selectedObject ? (
        <>
          <p style={{ color: "black" }}>
            Selected: {selectedObject}
          </p>

          <h3 style={{ color: "black" }}>
            Position
          </h3>

          <p style={{ color: "black" }}>
            X: {position[0]}
          </p>

          <p style={{ color: "black" }}>
            Y: {position[1]}
          </p>

          <p style={{ color: "black" }}>
            Z: {position[2]}
          </p>

          <h3 style={{ color: "black" }}>
            Size
          </h3>

          <p style={{ color: "black" }}>
            Width: {size[0]}
          </p>

          <p style={{ color: "black" }}>
            Height: {size[1]}
          </p>

          <p style={{ color: "black" }}>
            Depth: {size[2]}
          </p>
        </>
      ) : (
        <p style={{ color: "black" }}>
          No object selected
        </p>
      )}
    </div>
  );
}