import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
const MAX_ANGULAR_VELOCITY = 1;

export function useClampAngularVelocity({ api }) {
  const currentAngularVelocity = useRef([0, 0, 0]);
  useEffect(
    () =>
      api.angularVelocity.subscribe(
        (q) => (currentAngularVelocity.current = q)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    if (!api) {
      return;
    }

    const [x, y, z] = currentAngularVelocity.current.map((q) =>
      Math.max(-MAX_ANGULAR_VELOCITY, Math.min(MAX_ANGULAR_VELOCITY, q))
    );
    // clamp angular velocity
    api.angularVelocity.set(x, y, z);
  });
}
