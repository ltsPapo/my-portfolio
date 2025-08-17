import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import BanjoWave from './banjoWave';
import CustomModel from './CustomModel';
import PalmTree from './palmTree';
import { SunModel, MoonModel } from './SkyModels';
import TropicalBackground from './TropicalBackground';


function CelestialCycle() {
  const sunRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Group>(null);

  const speed = 0.2; // 👈 Slower oscillation speed (lower = slower)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const amplitude = 3; // vertical range
    const centerY = -2.5; // base Y position for island center

    const sunY = centerY + Math.sin(t * speed) * amplitude;
    const moonY = centerY + Math.sin(t * speed + Math.PI) * amplitude;

    if (sunRef.current) {
      sunRef.current.position.y = sunY;
    }
    if (moonRef.current) {
      moonRef.current.position.y = moonY;
    }
  });

  return (
    <>
      <group ref={sunRef} position={[0, 0.7, 0]}>
        <SunModel />
      </group>
      <group ref={moonRef} position={[0, -2, 0]}>
        <MoonModel />
      </group>
    </>
  );
}

function CycleController({ setCycle }: { setCycle: (value: number) => void }) {
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const newCycle = (Math.sin(t * 0.2) + 1) / 2;
    setCycle(newCycle);
  });
  return null;
}

function FadingStars({ cycle }: { cycle: number }) {
  const starsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 1.0 - cycle;
      material.transparent = true;
      material.depthWrite = false;
    }
  });

  return (
    <Stars
  ref={starsRef}
  radius={100}
  depth={50}
  count={3000}
  factor={4}
  saturation={0}
  fade
  speed={1}
/>
  );
}




function ParallaxCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame(({ mouse }) => {
    const smoothing = 0.05; // smaller = smoother

    // Update target values
    const x = mouse.x * 0.5;
    const y = mouse.y * 0.3;

    // Smooth interpolation
    targetX.current += (x - targetX.current) * smoothing;
    targetY.current += (y - targetY.current) * smoothing;

    if (cameraRef.current) {
      cameraRef.current.position.x = targetX.current;
      cameraRef.current.position.y = 2 + targetY.current;
      cameraRef.current.position.z = 8;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, 8]}
      fov={30}
    />
  );
}

export default function ThreeScene() {
  const [cycle, setCycle] = useState(0);

  return (
    <Canvas className="fixed inset-0 -z-10 w-full h-screen pointer-events-auto">
      <ParallaxCamera />
      <CycleController setCycle={setCycle} />
      <TropicalBackground cycle={cycle} />
      <FadingStars cycle={cycle} />


      {/* Lights and Models */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <CustomModel />
      <BanjoWave />
      <CelestialCycle />
      <PalmTree />
    </Canvas>
  );
}