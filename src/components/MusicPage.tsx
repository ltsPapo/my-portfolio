import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import MusicBackgroundModel from "./MusicBackgroundModel";

function AnimatedCamera({
    focus,
    targetPosition,
    targetLookAt,
}: {
    focus: boolean;
    targetPosition: [number, number, number];
    targetLookAt: [number, number, number];
}) {
    const { camera, mouse } = useThree();

    const { animatedPosition } = useSpring({
        animatedPosition: focus ? targetPosition : [0, 2, 5],
        config: { mass: 1, tension: 170, friction: 26 },
    });

    useFrame(() => {
        if (!focus) {
            const base = animatedPosition.get();
            camera.position.set(
                base[0] + mouse.x * 0.5,
                base[1] + mouse.y * 0.5,
                base[2]
            );
            camera.lookAt(0, 1, 0); // Center room when idle
        } else {
            animatedPosition.get().forEach((val, i) => {
                camera.position.setComponent(i, val);
            });
            camera.lookAt(new THREE.Vector3(...targetLookAt));
        }
    });

    return null;
}

const MusicPage: React.FC = () => {
    const [focusOnComputer, setFocusOnComputer] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 2, 5]);
    const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 1, 0]);

    // Fade-to-black after camera zoom
    useEffect(() => {
        if (focusOnComputer) {
            const timeout = setTimeout(() => setFadeOut(true), 800);
            return () => clearTimeout(timeout);
        }
    }, [focusOnComputer]);

    const handleComputerMeshReady = (mesh: THREE.Mesh) => {
    setTimeout(() => {
        const compPos = mesh.getWorldPosition(new THREE.Vector3());
        const compDir = new THREE.Vector3();
        mesh.getWorldDirection(compDir); // Direction the computer is facing

        const cameraOffset = compDir.clone().multiplyScalar(-1.2); // Move 1.2 units in front of the monitor
        const elevatedPos = compPos.clone().add(cameraOffset).add(new THREE.Vector3(0, 0.2, 0)); // elevate

        setTargetPosition([elevatedPos.x, elevatedPos.y, elevatedPos.z]);
        setTargetLookAt([compPos.x, compPos.y + 0.2, compPos.z]);
    }, 100);
};
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Canvas className="absolute inset-0 z-0">
                <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <directionalLight position={[5, 5, 5]} />
                    <AnimatedCamera
                        focus={focusOnComputer}
                        targetPosition={targetPosition}
                        targetLookAt={targetLookAt}
                    />
                    <MusicBackgroundModel
                        onComputerClick={() => setFocusOnComputer(true)}
                        onComputerMeshReady={handleComputerMeshReady}
                    />
                </Suspense>
            </Canvas>

            {/* Fade to black transition overlay */}
            {focusOnComputer && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <div
                        className={`w-full h-full transition-opacity duration-700 ease-in-out ${fadeOut ? "opacity-100 bg-black" : "opacity-0"
                            }`}
                    />
                </div>
            )}

            {/* Music player content */}
            {fadeOut && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/70 text-white p-6 rounded-lg">
                        <h1 className="text-2xl font-bold mb-2">Now Playing</h1>
                        {/* Insert your visualizer + playback controls here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPage;
