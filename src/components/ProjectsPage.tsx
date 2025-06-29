import ProjectCard from './ProjectCard';
import {
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiDatabricks,
  SiFramer,
  SiFlutter,
  SiGithub,
  SiRedis,
} from 'react-icons/si';
import { motion } from 'framer-motion';


const ProjectsPage = () => {
  const projects = [
    {
      title: 'SoundByte',
      timeline: 'June 2025 – Nov 2025',
      description:
        'A web-based music trivia game where users identify songs from short audio snippets. Includes multiple game modes, difficulty settings, and real-time scoring. Built with full-stack technologies and deployed using CI/CD.',
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
      description:
        'A web-based mental wellness application designed to help users manage stress and routines. Features journaling, personalized habits, and data persistence.',
      tags: ['Full Stack', 'Productivity', 'Mental Health'],
      techIcons: [<SiReact />, <SiTailwindcss />, <SiNodedotjs />, <SiExpress />, <SiMongodb />],
      links: {
        repo: 'https://github.com/yourusername/zenmind',
      },
    },
    {
      title: 'Firefit Exercise Tracker',
      timeline: 'January 2025 – April 2025',
      description:
        'A fitness tracking app for web and mobile. Supported customizable workouts, routine saving, and responsive design. Frontend built in React and Flutter, backend in Express.',
      tags: ['Full Stack', 'Mobile', 'Web App', 'Fitness'],
      techIcons: [<SiReact />, <SiFlutter />, <SiNodedotjs />, <SiExpress />, <SiMongodb />, <SiGithub />],
      links: {
        repo: 'https://github.com/yourusername/firefit',
      },
    },
  ];

  return (
    <div className="px-4 py-24">
      <h1 className="text-3xl font-bold text-center mb-2">Projects</h1>
      <p className="text-center text-gray-400 mb-8">
        Below are some of my most memorable projects that showcase my skills and experiences.
      </p>
      <motion.div
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mx-auto transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
