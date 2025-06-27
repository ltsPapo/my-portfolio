// SkillsSection.tsx
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
        color: 'from-blue-500 to-blue-300',
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
        color: 'from-pink-500 to-pink-300',
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
        color: 'from-green-500 to-green-300',
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
        color: 'from-yellow-400 to-yellow-200',
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
        <section id="skills" className="py-24 bg-gradient-to-b from-blue-100/60 to-blue-100/20">
            <h2 className="text-center text-4xl font-extrabold mb-12">Skills</h2>

            <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-4">
                {categories.map(({ title, color, skills }) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`rounded-xl bg-white/20 backdrop-blur-md p-6 shadow-lg ring-1 ring-white/30`}
                    >
                        {/* coloured bar */}
                        <div className={`h-2 -mt-6 -mx-6 mb-4 rounded-t-xl bg-gradient-to-r ${color}`} />

                        <h3 className="text-center text-2xl font-semibold mb-6">{title}</h3>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            {skills.map(({ label, icon }, index) => (
                                <div key={label} className="flex flex-col items-center space-y-2">
                                    <motion.span
                                        className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white text-2xl"
                                        animate={{
                                            y: [0, -2, 0],
                                            scale: [1, 1.03, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            ease: 'easeInOut',
                                            delay: index * 0.2, // 👈 delays by row
                                        }}
                                    >
                                        {icon}
                                    </motion.span>
                                    <span className="text-sm text-center text-blue-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}