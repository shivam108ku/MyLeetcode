'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import DynamicCard from '../ui/DynamicCard';
import Feature1 from './Feature1';

const Topics = () => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
      }}
      className="mt-14 md:mt-50"
    >
      <h1 className="text-center mx-auto w-[70%] text-2xl
      font-[arial]
      md:text-5xl tracking-tight   text-zinc-200">
        What We Are Providing To You
      </h1>

      <div className="flex flex-col md:flex-row flex-wrap 
      justify-center items-center gap-2 px-4 md:py-5">
        <DynamicCard
          title="Connect Your Friends"
          description="Smart-Code provides a feature where you can connect 
          your friends and code together."
        />
        <DynamicCard
          title="Learn with AI"
          description="Get smart suggestion by the help of ai to get better 
          understanding or multiple solution appropach."
        />
        <DynamicCard
          title="Ai analysis"
          description="Get ai analysis to explore multiple way to solve 
          your one problem."
        />
        <Feature1 />
      </div>
    </motion.div>
  );
};

export default Topics;
