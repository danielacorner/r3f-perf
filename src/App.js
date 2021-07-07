import { Physics } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Walls } from "./Walls";

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas style={{ height: window.innerHeight, width: window.innerWidth }}>
        <Physics>
          <Walls />
          <OrbitControls />
          <ambientLight />
          <directionalLight />
          <mesh>
            <icosahedronBufferGeometry args={[1, 0]} />
            <meshStandardMaterial metalness={0.5} roughness={0.5} />
          </mesh>
        </Physics>
      </Canvas>
    </Suspense>
  );
}

export default App;
