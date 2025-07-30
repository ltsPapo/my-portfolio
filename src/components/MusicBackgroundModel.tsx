import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

type MusicBackgroundProps = {
    onComputerClick: () => void;
    onComputerMeshReady?: (mesh: THREE.Mesh) => void;
};

const MusicBackgroundModel: React.FC<MusicBackgroundProps> = ({
    onComputerClick,
    onComputerMeshReady,
}) => {
    const { scene } = useGLTF('/musicbackground.glb'); // Adjust path as needed
    const clickableMeshRef = useRef<THREE.Mesh | null>(null);
    const computerMeshRef = useRef<THREE.Mesh | null>(null);
    const { camera } = useThree();

    useEffect(() => {
        scene.traverse((obj) => {
            if (obj.name.toLowerCase().includes("computer")) {
                console.log("🔎 Match:", obj.name, obj.position);
            }
        });
        if (!scene || computerMeshRef.current) return;

        // 🔍 Get the mesh named "computer"
        const mesh = scene.getObjectByName("computer") as THREE.Mesh;
        if (!mesh) {
            console.warn("❌ 'computer' mesh not found in scene");
            return;
        }

        // 📦 Use parent for accurate position
        const parent = mesh.parent;
        if (!parent) {
            console.warn("❌ 'computer' mesh has no parent");
            return;
        }

        parent.updateWorldMatrix(true, true);
        const worldPos = parent.getWorldPosition(new THREE.Vector3());
        console.log("✅ Final mesh for interaction:", parent.name);
        console.log("🌍 World position:", worldPos);

        // 🧱 Build a transparent clickable proxy box
        requestAnimationFrame(() => {
            const box = new THREE.Box3().setFromObject(parent);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            const proxy = new THREE.Mesh(
                new THREE.BoxGeometry(size.x, size.y, size.z),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 })
            );
            proxy.name = "computer_click_proxy";
            proxy.position.copy(center).add(new THREE.Vector3(0, 0.05, 0));
            proxy.rotation.copy(parent.rotation);
            proxy.visible = false;
            proxy.userData.interactive = true;

            const debugHelper = new THREE.BoxHelper(proxy, 0xff00ff);
            debugHelper.visible = true;

            scene.add(proxy); 

            // 💾 Save references
            clickableMeshRef.current = proxy;
            computerMeshRef.current = parent as THREE.Mesh;

            // 🎯 Send to camera logic
            if (onComputerMeshReady) {
                onComputerMeshReady(proxy); // use proxy directly — it’s where the computer really is
            }
        });
    }, [scene, onComputerMeshReady]);

    // 🖱️ Handle click interaction
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
    }, [onComputerClick, camera]);

    return <primitive object={scene} />;
};

export default MusicBackgroundModel;
