import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SunModel() {
    const ref = useRef<THREE.Object3D>(null)
    const { scene } = useGLTF('/low_poly_sun.glb')

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.z += 0.002 // slow horizontal spin
        }
    })

    return (
        <primitive
            object={scene}
            ref={ref}
            position={[4, 1.2, 2]}
            scale={0.005}
        />
    )
}

export function MoonModel() {
    const ref = useRef<THREE.Object3D>(null)
    const { scene } = useGLTF('/low_poly_moon.glb')

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.002 // even slower rotation
        }
    })

    return (
        <primitive
            object={scene}
            ref={ref}
            position={[-3.5, .4, 2.5]}
            scale={0.06}
        />
    )
}



