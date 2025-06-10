import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import './index.css'
import ThreeScene from './components/ThreeScene'
import { Parallax } from 'react-scroll-parallax'





function App() {
  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col">
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
  <header className="flex flex-col items-center justify-center h-screen text-center p-6">
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-6xl font-extrabold"
    >
      Welcome to My World
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="max-w-xl text-gray-300"
    >
      I'm Elias — a developer who codes like he kicks: with power, precision, and passion.
    </motion.p>
  </header>
</Parallax>
      </div>
      

      {/* 3D Canvas */}
      <section className="w-full h-[80vh]">
        <ThreeScene />
      </section>
    </div>
  )
}

export default App