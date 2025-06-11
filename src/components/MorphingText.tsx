import React, { useRef, useEffect } from "react";

const texts = [
  "Software Developer",
  "Martial Artist",
  "Music Lover",
  "Student",
  "Gamer",
  "Runner",
  "Coder"
];

const morphTime = 1;
const cooldownTime = 1.5;

const MorphingText: React.FC = () => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  // Animation state refs
  const textIndex = useRef(texts.length - 1);
  const time = useRef(new Date());
  const morph = useRef(0);
  const cooldown = useRef(cooldownTime);

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;

    text1Ref.current.textContent = texts[textIndex.current % texts.length];
    text2Ref.current.textContent = texts[(textIndex.current + 1) % texts.length];

    let animationFrame: number;

    function setMorph(fraction: number) {
      if (!text1Ref.current || !text2Ref.current) return;

      // Text 2
      text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      // Text 1
      const inv = 1 - fraction;
      text1Ref.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      text1Ref.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

      text1Ref.current.textContent = texts[textIndex.current % texts.length];
      text2Ref.current.textContent = texts[(textIndex.current + 1) % texts.length];
    }

    function doMorph() {
      morph.current -= cooldown.current;
      cooldown.current = 0;

      let fraction = morph.current / morphTime;

      if (fraction > 1) {
        cooldown.current = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function doCooldown() {
      morph.current = 0;
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    }

    function animate() {
      animationFrame = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown.current > 0;
      const dt = (+newTime - +time.current) / 1000;
      time.current = newTime;

      cooldown.current -= dt;

      if (cooldown.current <= 0) {
        if (shouldIncrementIndex) {
          textIndex.current++;
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div style={{
      position: "relative",
      margin: "auto",
      width: "100vw",
      height: "80pt",
      filter: "url(#threshold) blur(0.6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <span
        ref={text1Ref}
        style={{
          position: "absolute",
          width: "100%",
          display: "inline-block",
          fontFamily: "'Raleway', sans-serif",
          fontSize: "80pt",
          textAlign: "center",
          userSelect: "none",
          color: "white",
        }}
      />
      <span
        ref={text2Ref}
        style={{
          position: "absolute",
          width: "100%",
          display: "inline-block",
          fontFamily: "'Raleway', sans-serif",
          fontSize: "80pt",
          textAlign: "center",
          userSelect: "none",
          color: "white",
        }}
      />
      {/* SVG Filter */}
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default MorphingText;