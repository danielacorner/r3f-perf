import React from "react";
import { usePlane } from "@react-three/cannon";
import { Reflector, useDetectGPU, useMatcapTexture } from "@react-three/drei";

export function Plane({
  width = 100,
  height = 100,
  widthSegments = 1,
  heightSegments = 1,
  reflect = false,
  ...rest
}) {
  const [ref] = usePlane(() => ({
    ...rest,
  }));
  const [matcap] = useMatcapTexture(
    133, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  const { tier } = useDetectGPU();

  return (
    <mesh ref={ref} /* receiveShadow */>
      {reflect ? (
        <>
          {/* https://github.com/pmndrs/drei#reflector */}
          <Reflector
            args={[1, 1]} // PlaneBufferGeometry arguments
            resolution={tier >= 3 ? 512 : 256} // Off-buffer resolution, lower=faster, higher=better quality
            mirror={0.5} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            // mixBlur={1.0} // How much blur mixes with surface roughness (default = 0), note that this can affect performance
            mixStrength={1} // Strength of the reflections
            // depthScale={0.5} // Scale the depth factor (0 = no depth, default = 0)
            // minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
            // maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
            depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
            distortion={0} // Amount of distortion based on the distortionMap texture
            // distortionMap={distortionTexture} // The red channel of this texture is used as the distortion map. Default is null
            debug={
              0
            } /* Depending on the assigned value, one of the following channels is shown:
              0 = no debug
              1 = depth channel
              2 = base channel
              3 = distortion channel
              4 = lod channel (based on the roughness)
            */
          >
            {(Material, props) => (
              <>
                <Material {...props} />
                <planeGeometry
                  attach="geometry"
                  args={[width, height, widthSegments, heightSegments]}
                />
              </>
            )}
          </Reflector>
        </>
      ) : (
        <>
          <planeGeometry
            attach="geometry"
            args={[width, height, widthSegments, heightSegments]}
          />
          <meshMatcapMaterial
            matcap={matcap}
            opacity={0.15}
            transparent={true}
          />
        </>
      )}
    </mesh>
  );
}
