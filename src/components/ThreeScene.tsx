import { Canvas, useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

import BanjoWave from './banjoWave';
import CustomModel from './CustomModel';
import PalmTree from './palmTree';
import { SunModel, MoonModel } from './SkyModels';


function BackgroundColorSetter() {
  const { gl } = useThree();
  gl.setClearColor('#FDB99B');
  return null;
}


function ParallaxCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(({ mouse }) => {
    if (cameraRef.current) {
      const x = mouse.x * 0.5;
      const y = mouse.y * 0.3;
      cameraRef.current.position.x = x;
      cameraRef.current.position.y = 2 + y;
      cameraRef.current.position.z = -8;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, -8]}
      fov={30}
    />
  );
}

export default function ThreeScene() {
  return (
    <Canvas
  className="w-full h-screen"
  gl={{ alpha: false }}
  style={{ background: '#FDB99B' }}
>
  {/* Starry background
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      /> */}

  <ParallaxCamera />
  <BackgroundColorSetter />
  <ambientLight intensity={0.6} />
  <directionalLight position={[5, 5, 5]} />
  <CustomModel />
  <BanjoWave />
  <SunModel />
  <MoonModel />
  <PalmTree />
</Canvas>
  );
}
