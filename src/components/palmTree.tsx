import { useGLTF } from '@react-three/drei'
import '@react-three/fiber'
import '@react-three/drei'

useGLTF.preload('/palmTree.glb')

export default function CustomModel() {
  const gltf = useGLTF('/palmTree.glb')

  return (
    <primitive
      object={gltf.scene}
      scale={0.0065}              // Try 0.1 to 1 depending on size
      position={[-1, -1.5, .5]}  // Lower the model slightly
      rotation={[0, 0, 0]} // Optional: rotate to face front
    />
  )
}