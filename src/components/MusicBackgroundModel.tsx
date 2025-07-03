import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

import * as THREE from 'three';

type MusicBackgroundProps = {
    onComputerClick: () => void;
    onComputerMeshReady?: (mesh: THREE.Mesh) => void;
};

const MusicBackgroundModel: React.FC<MusicBackgroundProps> = ({ onComputerClick, onComputerMeshReady }) => {
    const { scene } = useGLTF('/musicbackground.glb'); // Adjust path as needed
    const clickableMeshRef = useRef<THREE.Mesh | null>(null);
    const computerMeshRef = useRef<THREE.Mesh | null>(null);
    const { camera } = useThree();

    useEffect(() => {
        console.log(scene);

        if (!scene || computerMeshRef.current) return;

        const computerMesh = scene.getObjectByName("computer") as THREE.Mesh; // <-- name may vary

        if (!computerMesh) {
            console.warn("computer mesh not found");
            return;
        }

        computerMesh.updateWorldMatrix(true, true);

        requestAnimationFrame(() => {
            const box = new THREE.Box3().setFromObject(computerMesh);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            const proxy = new THREE.Mesh(
                new THREE.BoxGeometry(size.x, size.y, size.z),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 })
            );
            proxy.geometry.computeBoundingBox();


            proxy.name = "computer_click_proxy";
            proxy.userData = { ...proxy.userData, isInteractive: true };
            proxy.castShadow = false;
            proxy.receiveShadow = false;
            proxy.position.copy(center);
            proxy.position.y += 0.05; // adjust if needed
            proxy.rotation.copy(computerMesh.rotation);
            proxy.visible = true;
            proxy.userData.interactive = true;

            const debugHelper = new THREE.BoxHelper(proxy, 0xff00ff); // purple
            debugHelper.visible = true;

            scene.add(proxy);
            scene.add(debugHelper);

            clickableMeshRef.current = proxy;
            computerMeshRef.current = computerMesh;

            if (onComputerMeshReady) {
                onComputerMeshReady(computerMesh);
            }
        });
    }, [scene, onComputerMeshReady]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            raycaster.setFromCamera(mouse, camera);
            if (clickableMeshRef.current) {
                const intersects = raycaster.intersectObject(clickableMeshRef.current, true);
                if (intersects.length > 0) {
                    onComputerClick();
                }
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [onComputerClick, camera, scene]);

    return <primitive object={scene} />;
};

export default MusicBackgroundModel;
