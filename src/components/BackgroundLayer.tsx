import { Stars } from "@react-three/drei";

export default function BackgroundLayer() {
  return (
    <>
      {/* Subtle star field in the background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </>
  );
}
