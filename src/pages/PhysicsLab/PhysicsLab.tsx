import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Box from "../../three/objects/Box";
import PropertyPanel from "../../components/panels/PropertyPanel";
import Toolbar from "../../components/layouts/Toolbar";
import Sidebar from "../../components/layouts/Sidebar";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function PhysicsLab() {
  const boxPosition: [number, number, number] = [0, 0.5, 0];
  const boxSize: [number, number, number] = [1, 1, 1];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar />

      <div
        style={{
          flex: 1,
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />

            <directionalLight
              position={[5, 10, 5]}
              intensity={1}
            />

            <Ground />

            <Grid />

            <Box
              id="box-1"
              position={boxPosition}
              size={boxSize}
            />

            <OrbitControls />
          </Canvas>

          <PropertyPanel
            position={boxPosition}
            size={boxSize}
          />
        </div>
      </div>
    </div>
  );
}