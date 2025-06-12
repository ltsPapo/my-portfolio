import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import './index.css'
import ThreeScene from './components/ThreeScene'
import { Parallax } from 'react-scroll-parallax'
import React, { useState, useEffect } from 'react'
import MorphingText from './components/MorphingText';



function App() {
  const phrases = ["Developer", "Designer", "Creator"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2000); // Change every 2 seconds
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="relative z-10 min-h-screen w-screen bg-transparent text-white flex flex-col">
      {/* Navbar */}
      <nav className="p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">Elias Oliphant</h1>
        <ul className="flex gap-4 text-sm">
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#projects" className="hover:underline">Projects</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <div className='relative z-10'>
        <Parallax speed={-10}>
          <header className="flex flex-col items-center justify-start h-[45vh] text-center pt-12 px-6">
            {/* Static intro text */}
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 z-10 relative">
              Hey, I'm Elias Oliphant!
            </h3>
            {/* Morphing text below */}
            <div className="w-full flex justify-center items-center">
              <MorphingText />
            </div>
          </header>
        </Parallax>
      </div>


      {/* 3D Canvas */}
      <section className="fixed inset-0 z-0">
        <ThreeScene />
      </section>
    </div>
  )
}

export default App