import { motion } from 'framer-motion';
import Reacrt from 'react';
import profileImg from '../assets/Portfolio_Grad.jpg'
import fightImg from '../assets/Portfolio_Fighting.jpg'
import SkillsSection from './SkillsSection';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';


const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-black px-6 pt-24">
            <motion.img
                src={profileImg}
                alt="Elias Oliphant"
                className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            />

            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    Who Am I?
                </motion.h1>

                <motion.p
                    className="text-lg leading-relaxed"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    I'm Elias Oliphant, a computer science student at the University of Central Florida, a martial arts instructor, and aspiring software engineer.
                    In my free time, I enjoy listening to music, playing video games, riding my bike, and spending time with friends and family.
                </motion.p>
            </div>

            <SkillsSection />


            <motion.img
                src={fightImg}
                alt="Elias training"
                className="w-full max-w-2xl rounded-lg mt-10 shadow-xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            />

            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    More About Me
                </motion.h1>

                <motion.p
                    className="text-lg leading-relaxed"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    Martial arts has been a huge part of my life since I was a child. I've competed in several different tournaments, and I am honored to be able to teach and instruct the next generation of martial artists. I believe that karate has taught me discipline, while code has taught me patience. Both require mastery over time, and I love them both.
                </motion.p>
            </div>

            <section className="mt-20 w-full flex flex-col items-center px-6">
                <h2 className="text-2xl font-bold mb-6">Links</h2>

                <div className="flex flex-wrap justify-center gap-6">
                    <motion.a
                        href="https://github.com/ltsPapo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaGithub className="text-xl" />
                        GitHub
                    </motion.a>

                    <motion.a
                        href="https://www.linkedin.com/in/eliasolip"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaLinkedin className="text-xl" />
                        LinkedIn
                    </motion.a>

                    <motion.a
                        href="/Oliphant_Resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        <HiOutlineDocumentText className="text-xl" />
                        Resume
                    </motion.a>
                </div>
            </section>
        </main>
    );
}
