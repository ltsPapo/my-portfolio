import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ThreeScene from './components/ThreeScene';
import AboutPage from './components/AboutPage';
import MorphingText from './components/MorphingText';
import { Parallax } from 'react-scroll-parallax';
import PageWrapper from './components/PageWrapper';
import ProjectsPage from './components/ProjectsPage';
import { Link } from 'react-router-dom';
import CareerPage from './components/CareerPage';
import MusicPage from './components/MusicPage';
import { motion } from 'framer-motion';






export default function App() {
  const location = useLocation();

  return (
    <div className="relative w-screen min-h-screen text-white">
      <nav className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center backdrop-blur-md bg-transparent">
        <h1 className="text-2xl font-bold">
          <Link to="/">Elias Oliphant</Link> {/* Updated from <a href="/"> */}
        </h1>
        <ul className="flex gap-6 text-sm">
  {[
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/career', label: 'Career' },
    { to: '/music', label: 'Music' },
  ].map(({ to, label }) => (
    <motion.li
      key={to}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative group"
    >
      <Link to={to} className="text-white">
        {label}
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </motion.li>
  ))}
</ul>
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <section className="fixed inset-0 -z-10">
                  <ThreeScene />
                </section>
                <div className="relative z-10 pointer-events-none">
                  <Parallax speed={-10}>
                    <header className="flex flex-col items-center justify-start h-[45vh] text-center pt-20 px-6">
                      <h3 className="text-2xl md:text-3xl font-semibold mb-4">Hey, I'm Elias Oliphant!</h3>
                      <MorphingText />
                    </header>
                  </Parallax>
                </div>
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            }
          />
          <Route
            path="/projects"
            element={
              <PageWrapper>
                <ProjectsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/career"
            element={
              <PageWrapper>
                <CareerPage />
              </PageWrapper>
            }
          />
          <Route
            path="/music"
            element={
              <PageWrapper>
                <MusicPage />
              </PageWrapper>
            }
          />
        </Routes>
        
      </AnimatePresence>
    </div>
  );
}
