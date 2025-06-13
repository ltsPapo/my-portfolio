import { useGLTF } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BanjoWave() {
  const { scene, animations } = useGLTF('/banjo_waving.glb')
  const ref = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    if (ref.current && animations.length) {
      mixerRef.current = new THREE.AnimationMixer(ref.current)
      const action = mixerRef.current.clipAction(animations[0])
      action.play()
    }

    return () => {
      mixerRef.current?.stopAllAction()
    }
  }, [animations])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
  })

  return <primitive object={scene} scale={1} position={[-1, -1.30, 1.3]} rotation={[0, 0, 0]} ref={ref} />
}