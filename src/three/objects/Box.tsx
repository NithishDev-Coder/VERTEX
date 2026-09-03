import { useUIStore } from "../../stores/uiStore";

interface BoxProps {
  id: string;
  position?: [number, number, number];
  size?: [number, number, number];
}

export default function Box({
  id,
  position = [0, 0.5, 0],
  size = [1, 1, 1],
}: BoxProps) {

  const setSelectedObject = useUIStore(
    (state) => state.setSelectedObject
  );

  const selectedObject = useUIStore(
    (state) => state.selectedObject
  );

  const isSelected = selectedObject === id;

  return (
    <mesh
      position={position}
      onClick={() => setSelectedObject(id)}
    >
      <boxGeometry args={size} />

      <meshStandardMaterial
        color={isSelected ? "orange" : "white"}
      />
    </mesh>
  );
}