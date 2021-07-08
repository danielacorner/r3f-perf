import { Physics, useConvexPolyhedron } from "@react-three/cannon";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Walls } from "./Walls";
import { Geometry } from "three-stdlib";
import * as THREE from "three";

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas style={{ height: window.innerHeight, width: window.innerWidth }}>
        <Stats />
        <Physics gravity={[0, 0, 0]}>
          <Walls />
          <OrbitControls />
          <ambientLight />
          <directionalLight />

          {[...Array(50)].map((_, idx) => (
            <Thing key={idx} />
          ))}
        </Physics>
      </Canvas>
    </Suspense>
  );
}

export default App;

function Thing() {
  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(1, 0)),
    []
  );

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: 1,
    args: geo,
  }));

  return (
    <mesh ref={ref}>
      <icosahedronBufferGeometry args={[1, 0]} />
      <meshStandardMaterial metalness={0.5} roughness={0.5} color={"tomato"} />
    </mesh>
  );
}

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {THREE.BufferGeometry} bufferGeometry
 */
function toConvexProps(bufferGeometry) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}
