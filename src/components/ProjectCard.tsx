import type { FC } from 'react';
import * as React from 'react';


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
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="text-sm text-gray-500">{timeline}</p>
      </div>
      <p className="text-base text-gray-700 dark:text-gray-300">{description}</p>

      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 text-sm bg-slate-700 text-white rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

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
