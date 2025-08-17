import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useMemo } from 'react';

type TropicalBackgroundProps = {
  cycle: number;
};

// Define shader material class (uniform defaults)
const TropicalMaterial = shaderMaterial(
  {
    uTime: 0,
    uCycle: 0,
    uColor1Day: new THREE.Color('#EFB3FF'),
    uColor2Day: new THREE.Color('#FFDDE1'),
    uColor1Night: new THREE.Color('#355C7D'),
    uColor2Night: new THREE.Color('#6C5B7B'),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uCycle;
    uniform vec3 uColor1Day;
    uniform vec3 uColor2Day;
    uniform vec3 uColor1Night;
    uniform vec3 uColor2Night;

    varying vec2 vUv;

    void main() {
      vec3 color1 = mix(uColor1Night, uColor1Day, uCycle);
      vec3 color2 = mix(uColor2Night, uColor2Day, uCycle);

      float wave = sin(vUv.y * 10.0 + uTime * 0.5) * 0.02;
      vec3 finalColor = mix(color1, color2, vUv.y + wave);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Typed instance so uniforms are accessible
type TropicalInstance = InstanceType<typeof TropicalMaterial> & {
  uTime: number;
  uCycle: number;
  uColor1Day: THREE.Color;
  uColor2Day: THREE.Color;
  uColor1Night: THREE.Color;
  uColor2Night: THREE.Color;
};

export default function TropicalBackground({ cycle }: TropicalBackgroundProps) {
  // Create a single material instance (no JSX augmentation required)
  const material = useMemo<TropicalInstance>(
    () => new (TropicalMaterial as unknown as new () => TropicalInstance)(),
    []
  );

  // Drive uniforms per frame
  useFrame(({ clock }) => {
    material.uTime = clock.getElapsedTime();
    material.uCycle = cycle;
  });

  return (
    <mesh position={[0, 0, -50]} scale={[200, 200, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* Mount the shader as the mesh material */}
      <primitive attach="material" object={material} />
    </mesh>
  );
}