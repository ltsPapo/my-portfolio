import type { FC } from 'react';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  description: string;
  timeline: string;
  techIcons: React.ReactNode[];
  links?: { live?: string; repo?: string };
  tags?: string[];
};

const ProjectCard: FC<Props> = ({ title, description, timeline, techIcons, links, tags }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-blue-300">{title}</h2>
        <p className="text-sm text-gray-400 italic">{timeline}</p>
      </div>

      <p className="text-base text-gray-300">{description}</p>

      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-sm bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {techIcons.map((Icon, i) => (
          <motion.div
            key={i}
            className="p-2 bg-black text-white rounded-full text-xl shadow-sm"
            animate={{
              y: [0, -3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          >
            {Icon}
          </motion.div>
        ))}
      </div>

      {links && (
        <div className="flex flex-wrap gap-4 pt-4">
          {links.live && (
            <a
              href={links.live}
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Live
            </a>
          )}
          {links.repo && (
            <a
              href={links.repo}
              target="_blank"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Code
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;