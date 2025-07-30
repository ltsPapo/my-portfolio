import React, { Suspense, useEffect, useState, useRef } from "react";
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

  const offsetX = useRef(0);
  const offsetY = useRef(0);

  useFrame(() => {
    const base = animatedPosition.get();

    if (!focus) {
      const smoothing = 0.05;
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.4;

      offsetX.current += (targetX - offsetX.current) * smoothing;
      offsetY.current += (targetY - offsetY.current) * smoothing;

      camera.position.set(
        base[0] + offsetX.current,
        base[1] + offsetY.current,
        base[2]
      );
      camera.lookAt(0, 1, 0);
    } else {
      for (let i = 0; i < 3; i++) {
        camera.position.setComponent(i, base[i]);
      }
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
  const [topTracks, setTopTracks] = useState<any[]>([]);

  // Fetch Spotify top tracks after zoom
  useEffect(() => {
    if (fadeOut) {
      const fetchTopTracks = async () => {
        try {
          const response = await fetch("/api/spotify/top-tracks");
          const data = await response.json();
          setTopTracks(data.items);
        } catch (error) {
          console.error("Failed to fetch top tracks:", error);
        }
      };
      fetchTopTracks();
    }
  }, [fadeOut]);

  // Fade after zoom-in
  useEffect(() => {
    if (focusOnComputer) {
      const timeout = setTimeout(() => setFadeOut(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [focusOnComputer]);

  const handleComputerMeshReady = (mesh: THREE.Mesh) => {
    setTimeout(() => {
      const compPos = mesh.getWorldPosition(new THREE.Vector3());
      const cameraOffset = new THREE.Vector3(0, 0, 0.95);
      const elevatedPos = compPos.clone().add(cameraOffset);

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
          <div className={`w-full h-full transition-opacity duration-700 ease-in-out ${fadeOut ? "opacity-100 bg-black" : "opacity-0"}`} />
        </div>
      )}

      {/* Music player content */}
      {fadeOut && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white p-6 rounded-lg max-w-md pointer-events-auto">
            <h1 className="text-2xl font-bold mb-4">Top Spotify Tracks</h1>
            {topTracks.length === 0 ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <ul className="space-y-3">
                {topTracks.map((track, idx) => (
                  <li key={track.id} className="flex items-center gap-3">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{track.name}</p>
                      <p className="text-xs text-gray-400">{track.artists[0].name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;
