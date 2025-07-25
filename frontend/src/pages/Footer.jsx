import React from 'react';
import footimg from '../assets/footback.png';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <img
        src={footimg}
        alt="footer background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content over image */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1
          className="text-6xl sm:text-8xl font-black font-[arial] tracking-wide drop-shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Smart Code
        </motion.h1>
      </div>
    </div>
  );
};

export default Footer;
