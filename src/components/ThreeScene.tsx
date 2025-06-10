import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Stars } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import BanjoWave from './banjoWave'
import CustomModel from './CustomModel'

function ParallaxCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ mouse }) => {
    if (cameraRef.current) {
      const x = mouse.x * 0.5
      const y = mouse.y * 0.3

      // Set new camera position that starts at front of island
      cameraRef.current.position.x = x
      cameraRef.current.position.y = 2 + y
      cameraRef.current.position.z = -8 // ⬅️ move camera to the front

      cameraRef.current.lookAt(0, 0, 0) // always look at island center
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, -8]}
      fov={40}
    />
  )
}

export default function ThreeScene() {
  return (
    <Canvas className="w-full h-full">
      <ParallaxCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <CustomModel />
      <BanjoWave />
      <Stars />
    </Canvas>
  )
}
