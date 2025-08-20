import { motion } from 'framer-motion';
import {
  SiReact, SiExpress, SiTailwindcss, SiThreedotjs, SiNodedotjs,
  SiOpenjdk, SiJavascript, SiTypescript, SiPython,
  SiHtml5, SiCss3, SiC, SiCplusplus, SiBlender, SiMongodb, SiGithub,
  SiVscodium, SiOpenai, SiLangchain, SiHuggingface, SiCloudinary, SiRedis
} from 'react-icons/si';
import { FaBrain, FaVolumeUp } from 'react-icons/fa';

type Skill = { label: string; icon: React.ReactNode };
type Category = { title: string; color: string; skills: Skill[] };

const categories: Category[] = [
  {
    title: 'Frameworks',
    color: 'from-blue-700 to-blue-500',
    skills: [
      { label: 'React', icon: <SiReact /> },
      { label: 'Express', icon: <SiExpress /> },
      { label: 'Tailwind', icon: <SiTailwindcss /> },
      { label: 'ThreeJS', icon: <SiThreedotjs /> },
      { label: 'NodeJS', icon: <SiNodedotjs /> },
      { label: 'Howler.js', icon: <FaVolumeUp /> },
    ],
  },
  {
    title: 'Languages',
    color: 'from-purple-700 to-purple-500',
    skills: [
      { label: 'Java', icon: <SiOpenjdk /> },
      { label: 'JavaScript', icon: <SiJavascript /> },
      { label: 'TS', icon: <SiTypescript /> },
      { label: 'Python', icon: <SiPython /> },
      { label: 'HTML', icon: <SiHtml5 /> },
      { label: 'CSS', icon: <SiCss3 /> },
      { label: 'C', icon: <SiC /> },
      { label: 'C++', icon: <SiCplusplus /> },
    ],
  },
  {
    title: 'Tools',
    color: 'from-green-700 to-green-500',
    skills: [
      { label: 'Blender', icon: <SiBlender /> },
      { label: 'MongoDB', icon: <SiMongodb /> },
      { label: 'Github', icon: <SiGithub /> },
      { label: 'VS Code', icon: <SiVscodium /> },
      { label: 'Cloudinary', icon: <SiCloudinary /> },
      { label: 'Redis', icon: <SiRedis /> },
    ],
  },
  {
    title: 'AI & LLMs',
    color: 'from-yellow-500 to-yellow-300',
    skills: [
      { label: 'GPT', icon: <SiOpenai /> },
      { label: 'Llama', icon: <FaBrain /> },
      { label: 'LangChain', icon: <SiLangchain /> },
      { label: 'Hugging Face', icon: <SiHuggingface /> },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <h2 className="text-center text-4xl font-extrabold mb-12 text-blue-300">Skills</h2>

      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-4">
        {categories.map(({ title, color, skills }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-xl bg-gray-800/70 backdrop-blur-md p-6 shadow-md ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300`}
          >
            <div className={`h-2 -mt-6 -mx-6 mb-4 rounded-t-xl bg-gradient-to-r ${color}`} />

            <h3 className="text-center text-xl font-semibold mb-6 text-blue-200">{title}</h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {skills.map(({ label, icon }, index) => (
                <div key={label} className="flex flex-col items-center space-y-2">
                  <motion.div
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 text-white text-2xl shadow-md"
                    animate={{
                      y: [0, -4, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  >
                    {icon}
                  </motion.div>
                  <span className="text-sm text-center text-gray-300">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}