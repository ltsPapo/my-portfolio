import ProjectCard from './ProjectCard';
import {
  SiReact, SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiFirebase,
  SiDatabricks, SiFramer, SiFlutter, SiGithub, SiRedis,
} from 'react-icons/si';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const projects = [
    {
      title: 'SoundByte',
      timeline: 'June 2025 – Nov 2025',
      description: 'A web-based music trivia game where users identify songs from short audio snippets. Includes multiple game modes, difficulty settings, and real-time scoring.',
      tags: ['Full Stack', 'Multiplayer', 'Web App'],
      techIcons: [<SiReact />, <SiTailwindcss />, <SiNodedotjs />, <SiFirebase />, <SiMongodb />, <SiRedis />, <SiDatabricks />, <SiFramer />],
      links: {
        live: 'https://soundbyte.app',
        repo: 'https://github.com/yourusername/soundbyte',
      },
    },
    {
      title: 'ZenMind',
      timeline: 'January 2025 – April 2025',
      description: 'A web-based mental wellness application designed to help users manage stress and routines. Features journaling, personalized habits, and data persistence.',
      tags: ['Full Stack', 'Productivity', 'Mental Health'],
      techIcons: [<SiReact />, <SiTailwindcss />, <SiNodedotjs />, <SiExpress />, <SiMongodb />],
      links: {
        repo: 'https://github.com/yourusername/zenmind',
      },
    },
    {
      title: 'Firefit Exercise Tracker',
      timeline: 'January 2025 – April 2025',
      description: 'A fitness tracking app for web and mobile. Supported customizable workouts, routine saving, and responsive design. Built in React, Flutter, and Express.',
      tags: ['Full Stack', 'Mobile', 'Web App', 'Fitness'],
      techIcons: [<SiReact />, <SiFlutter />, <SiNodedotjs />, <SiExpress />, <SiMongodb />, <SiGithub />],
      links: {
        repo: 'https://github.com/yourusername/firefit',
      },
    },
  ];

  return (
    <div className="relative min-h-screen px-4 py-24 text-gray-100 font-poppins
                bg-fixed bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-4xl font-bold text-center mb-3 text-blue-300">Projects</h1>
      <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
        Below are some of my most memorable projects that showcase my skills, creativity, and full-stack capabilities.
      </p>

      <motion.div
        className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.03] shadow-lg ring-1 ring-white/10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;