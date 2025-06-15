import * as THREE from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';

type TropicalBackgroundProps = {
  cycle: number;
};


// Define shader material
const TropicalMaterial = shaderMaterial(
  {
    uTime: 0,
    uCycle: 0,
    uColor1Day: new THREE.Color('#EFB3FF'), // pink-lavender
    uColor2Day: new THREE.Color('#FFDDE1'), // soft pink
    uColor1Night: new THREE.Color('#355C7D'), // cool blue
    uColor2Night: new THREE.Color('#6C5B7B'), // dusk purple
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
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

// Register material with R3F
extend({ TropicalMaterial });

// Extend JSX for TypeScript
declare module '@react-three/fiber' {
  interface ThreeElements {
    tropicalMaterial: any;
  }
}

export default function TropicalBackground({ cycle }: TropicalBackgroundProps) {
  const ref = useRef<any>(null);
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime();
      ref.current.uCycle = cycle;
    }
  });

  return (
    <mesh position={[0, 0, -50]} scale={[200, 200, 1]}>
      <planeGeometry args={[1, 1]} />
      <tropicalMaterial ref={ref} />
    </mesh>
  );
}
