import type { FC } from 'react';
import { SiTypescript, SiNextdotjs, SiMongodb } from 'react-icons/si';
import * as React from 'react';


type Props = {
  title: string;
  description: string;
  timeline: string;
  techIcons: React.ReactNode[];
  links?: { live?: string; repo?: string };
};

const ProjectCard: FC<Props> = ({ title, description, timeline, techIcons, links }) => {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto space-y-4 transition-transform hover:scale-[1.02]">
      <div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="text-sm text-gray-500">{timeline}</p>
      </div>
      <p className="text-base text-gray-700 dark:text-gray-300">{description}</p>
      <div className="flex flex-wrap gap-2">
        {techIcons.map((Icon, i) => (
          <div key={i} className="p-2 bg-black text-white rounded-full">{Icon}</div>
        ))}
      </div>
      {links && (
        <div className="flex gap-4 pt-2">
          {links.live && <a href={links.live} target="_blank" className="text-blue-500 underline">Live</a>}
          {links.repo && <a href={links.repo} target="_blank" className="text-blue-500 underline">Code</a>}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
