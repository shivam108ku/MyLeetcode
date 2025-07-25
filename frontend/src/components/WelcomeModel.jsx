import Spline from '@splinetool/react-spline';
import { useState } from 'react';

const WelcomeModel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  return (
    <div
      className="w-full bg-gradient-to-br from-[#0C0C0C] via-[#000000] to-[#534a00cc] h-screen relative"
      onMouseEnter={() => setIsHovered(true)}
    >
      {isHovered && (
        <>
          {/* Show Loading Text Until Model Loads */}
          {!modelLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl 
            font-black z-10">
              Loading model...
            </div>
          )}

          {/* Spline Model */}
          <Spline
            className="absolute top-0 left-0 w-full h-full"
            scene="https://prod.spline.design/Zrly6joxo14HByO2/scene.splinecode"
            onLoad={() => setModelLoaded(true)}
          />

          {/* Overlay content (optional) */}
          <div className="absolute right-4 -bottom-20 h-2 select-none text-white px-18 py-5 bg-black">
            .
          </div>
        </>
      )}
    </div>
  );
};

export default WelcomeModel;
