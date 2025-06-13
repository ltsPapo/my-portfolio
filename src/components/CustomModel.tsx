import { useGLTF } from '@react-three/drei'
import '@react-three/fiber'
import '@react-three/drei'

useGLTF.preload('/model.glb')

export default function CustomModel() {
  const gltf = useGLTF('/model.glb')

  return (
    <primitive
      object={gltf.scene}
      scale={0.08}              // Try 0.1 to 1 depending on size
      position={[0, -1.5, 0]}  // Lower the model slightly
      rotation={[0, 0, 0]} // Optional: rotate to face front
    />
  )
}