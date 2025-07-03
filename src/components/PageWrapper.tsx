import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const noAnimationPages = ['/', '/music']; // Add any other 3D routes here
  const disableAnimation = noAnimationPages.includes(location.pathname);

  if (disableAnimation) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
