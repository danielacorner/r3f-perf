import React from "react";
import { Plane } from "./Plane";

export function Walls() {
  const reflect = true;
  const worldRadius = 5;
  const walls = [
    // {/* behind (back wall) */}
    {
      rotation: [0 * Math.PI, 0, 0],
      position: [0, -0, -worldRadius],
      reflect,
    },
    // {/* in front (camera-side) */}
    {
      rotation: [0, -1 * Math.PI, 0],
      position: [0, -0, worldRadius],
      reflect: true,
    },
    // {/* left */}
    {
      rotation: [0, 0.5 * Math.PI, 0],
      position: [-worldRadius, 0, 0],
      reflect,
    },
    // {/* right */}
    {
      rotation: [0, -0.5 * Math.PI, 0],
      position: [worldRadius, -0, 0],
      reflect,
    },
    // {/* floor */}
    {
      rotation: [-0.5 * Math.PI, 0, 0],
      position: [0, -worldRadius, 0],
      reflect,
    },
    // {/* ceiling */}
    {
      rotation: [0.5 * Math.PI, 0, 0],
      position: [0, worldRadius, 0],
      // reflect,
    },
  ];

  return (
    <>
      {walls.map((props, idx) => (
        <Plane
          {...props}
          key={idx}
          width={worldRadius * 2}
          height={worldRadius * 2}
        />
      ))}
    </>
  );
}
