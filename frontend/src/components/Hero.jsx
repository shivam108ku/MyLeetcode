import { useRef, useEffect } from 'react';
import { SquareCode } from 'lucide-react';
import ShinyText from '../ui/ShinyText';
import { Link } from 'react-router';
import back from '../assets/back2.png';
import gsap from 'gsap';

const Hero = () => {
  // References to elements
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  textRefs.current = [];

  // Helper to add refs
  const addToRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      textRefs.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 3,
        ease: 'power3.out',
        stagger: 0.15,
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundImage: `url(${back})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
      className="flex justify-center items-center"
    >
      <div className="flex flex-col items-center gap-5 w-[90%] md:w-[50%]">
        {/* Text elements, assign animate refs */}
        <h1
          ref={addToRefs}
          className="text-3xl font-extrabold text-center md:text-5xl"
        >
          <ShinyText
            text="Elevate Your Code Game With SmartCode"
            disabled={false}
            speed={4}
            className="custom-class"
          />
        </h1>
        <p
          ref={addToRefs}
          className="text-center text-sm md:text-base"
        >
          SmartCode is your personalized coding playground built for aspiring developers and competitive programmers.
        </p>
        <div
          ref={addToRefs}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center w-full"
        >
          <Link
            to="/signup"
            className="px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-[#643a13] to-[#504b3f] via-[#45340b] rounded-lg font-semibold tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
          >
            Join Us
          </Link>
          <button
            className="px-6 py-2 text-xs sm:text-sm border-[0.1px] border-zinc-500 flex justify-center items-center gap-2 bg-zinc-950 rounded-lg font-semibold tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <span>
              <SquareCode />
            </span>
            GET STARTED
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Hero;
