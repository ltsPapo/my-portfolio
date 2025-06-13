import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

import BanjoWave from './banjoWave';
import CustomModel from './CustomModel';
import PalmTree from './palmTree';
import { SunModel, MoonModel } from './SkyModels';
import TropicalBackground from './TropicalBackground';


function CelestialCycle() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.2; // adjust speed as needed
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Adjust orbit radius as needed to fit in camera */}
      <group position={[0, .7, 0]}>
        <SunModel />
      </group>
      <group position={[0, -2, 0]}>
        <MoonModel />
      </group>
    </group>
  );
}




function ParallaxCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(({ mouse }) => {
    if (cameraRef.current) {
      const x = mouse.x * 0.5;
      const y = mouse.y * 0.3;
      cameraRef.current.position.x = x;
      cameraRef.current.position.y = 2 + y;
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
  return (
    <Canvas className="w-full h-screen">
      <ParallaxCamera />
      <TropicalBackground />

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      
        <CustomModel />
        <BanjoWave />
        <CelestialCycle />
        <PalmTree />
    </Canvas>
  );
}