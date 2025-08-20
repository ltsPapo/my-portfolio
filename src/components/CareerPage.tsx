import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaRocket, FaSeedling } from 'react-icons/fa';

const CareerPage = () => {
  return (
    <div className="min-h-screen px-4 md:px-8 py-16 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Career Timeline
      </motion.h1>
      <motion.p
        className="text-center text-gray-300 mt-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        A glance at my academic and professional milestones so far.
      </motion.p>

      <VerticalTimeline animate={true}>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: '#1e293b', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #1e293b' }}
          date="2021 – 2025"
          iconStyle={{ background: '#3b82f6', color: '#fff' }}
          icon={<FaGraduationCap />}
        >
          <h3 className="vertical-timeline-element-title font-bold text-lg">B.S. in Computer Science</h3>
          <h4 className="vertical-timeline-element-subtitle text-blue-400">University of Central Florida</h4>
          <p>
            Developing strong foundations in software engineering, mobile development, and cybersecurity. Built full-stack projects and explored real-world problem solving.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#1e293b', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #1e293b' }}
          date="2023 – Present"
          iconStyle={{ background: '#10b981', color: '#fff' }}
          icon={<FaChalkboardTeacher />}
          position="right"
        >
          <h3 className="vertical-timeline-element-title font-bold text-lg">Assistant Martial Arts Instructor</h3>
          <h4 className="vertical-timeline-element-subtitle text-blue-400">Championship Martial Arts</h4>
          <p>
            Taught structured classes for youth and adults, promoted discipline and focus, and helped students develop confidence through consistent practice.
          </p>
        </VerticalTimelineElement>

        {/* 🆕 Software Intern @ Todd */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#1e293b', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #1e293b' }}
          date="Summer–Fall 2025"
          iconStyle={{ background: '#059669', color: '#fff' }} // emerald-600 vibe for agriculture
          icon={<FaSeedling />}
        >
          <h3 className="vertical-timeline-element-title font-bold text-lg">Software Intern</h3>
          <h4 className="vertical-timeline-element-subtitle text-blue-400">Todd • Remote/Hybrid</h4>
          <p className="text-white/90">
            Selected for Todd’s Summer–Fall Internship Program to build software in the agriculture space. Contributed to cross‑department projects that supported client needs and business objectives, participated in in‑house education on ag fundamentals, and collaborated with mentors and senior leaders. Responsibilities spanned frontend design and implentation for website and dashboard, research & analysis, and coordination with partnerships & client services.
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--future"
          contentStyle={{ background: '#1e293b', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #1e293b' }}
          date="Now"
          iconStyle={{ background: '#f59e0b', color: '#fff' }}
          icon={<FaRocket />}
          position="right"
        >
          <h3 className="vertical-timeline-element-title font-bold text-lg">To Be Continued…</h3>
          <h4 className="vertical-timeline-element-subtitle text-blue-400">Seeking Full-Time Software Engineering Positions</h4>
          <p>
            Actively applying for full-time positions in software engineering to continue my growth in a real-world tech environment and make meaningful impact.
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>

      <div className="flex justify-center mt-10">
        <a
          href="/Oliphant_Resume.pdf"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          View My Resume
        </a>
      </div>
    </div>
  );
};

export default CareerPage;