import { Physics, useConvexPolyhedron } from "@react-three/cannon";
import { OrbitControls, Stats, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Walls } from "./Walls";
import { Geometry } from "three-stdlib";
import * as THREE from "three";
import "./index.css";
import { useClampAngularVelocity } from "./useClampAngularVelocity";
import RiceDwarfVirus from "./gltfjsx/Rice_dwarf_100";
import DengueVirus from "./gltfjsx/Denguevirus_50";
import Bacteriophage from "./gltfjsx/Bacteriophage_P68_120";
import Faustovirus from "./gltfjsx/Faust_1200_1";
import { LoadingIndicator } from "./LoadingIndicator";

function App() {
  const { active } = useProgress();
  return (
    <Suspense fallback={null}>
      {active ? (
        <LoadingIndicator />
      ) : (
        <Canvas
          style={{ height: window.innerHeight, width: window.innerWidth }}
        >
          <Stats />
          <Physics gravity={[0, 0, 0]}>
            <Walls />
            <OrbitControls />
            <ambientLight />
            <directionalLight />
            {[RiceDwarfVirus, DengueVirus, Bacteriophage, Faustovirus].map(
              (Component, idx) => (
                <Thing key={idx} {...{ Component }} />
              )
            )}
          </Physics>
        </Canvas>
      )}
    </Suspense>
  );
}

export default App;

function Thing({ Component }) {
  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(1, 0)),
    []
  );

  const [ref, api] = useConvexPolyhedron(() => ({
    // TODO: accurate mass data from PDB --> need to multiply by number of residues or something else? doesn't seem right
    mass: 1,
    args: geo,
  }));

  useClampAngularVelocity({ api });

  return (
    <mesh ref={ref}>
      <Component scale={[0.0025, 0.0025, 0.0025]} />
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
