import { motion } from 'framer-motion';
import React from 'react';

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
};

const CareerEvent: React.FC<Props> = ({ icon, title, subtitle, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="min-w-[280px] sm:min-w-[340px] md:min-w-[400px] bg-white/10 border border-white/20 rounded-xl p-6 mx-4 flex-shrink-0 text-left"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-white/20 p-2 rounded-full">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-white/60">{subtitle}</p>
        </div>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default CareerEvent;
