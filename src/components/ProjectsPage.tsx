import ProjectCard from './ProjectCard';
import { SiNextdotjs, SiTypescript, SiMongodb, SiVite, SiTailwindcss } from 'react-icons/si';

const ProjectsPage = () => {
  const projects = [
    {
      title: 'SoundByte',
      timeline: 'Spring 2025',
      description: 'A full-stack music quiz game built using React, Express, and MongoDB. Includes multiplayer support and animations.',
      techIcons: [<SiTypescript />, <SiNextdotjs />, <SiMongodb />],
      links: {
        live: 'https://soundbyte.app',
        repo: 'https://github.com/yourusername/soundbyte',
      },
    },
    // Add more projects here
  ];

  return (
    <div className="pt-20 px-4 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2">Projects</h1>
      <p className="text-center text-gray-400 mb-8">
        Below are some of my most memorable projects that showcase my skills and experiences.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
