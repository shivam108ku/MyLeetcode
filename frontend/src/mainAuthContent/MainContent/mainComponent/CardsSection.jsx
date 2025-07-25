
import SpotlightCard from '../../../ui/SpotlightCard';
import StarBorder from '../../../ui/StarBorder';
import connection from '../../../assets/connections.png'
import { RadioTower } from 'lucide-react';
import goals from '../mainAssets/goalss.mp4'
import goal from '../mainAssets/goal.jpg'
import { Link } from 'react-router';
import Leaderboard from './LeaderBoard';

const ProbemCard = () => {

  return (
    <div className="flex flex-col justify-between gap-10 items-center 
    mx-auto w-[95%]  rounded-2xl">

      <SpotlightCard
        className="custom-spotlight-card w-full h-[320px] md:h-[450px]"
        spotlightColor="rgba(255, 255, 0, 0.2)"
      >
        <div className="text-zinc-400 font-semibold text-center p-4">
          <img src={connection} alt="" />
          <h1 className='mt-8 '>Code Together, Anywhere.
            Invite your friends and collaborate in a single room — in real time.</h1>

            <Link to={'/problems-page/group-coding'} >
            
          <StarBorder
            as="button"
            className="custom-class cursor-pointer mt-7 active:scale-9 "
            color="cyan"
            speed="5s"
          >
            <span className='text-sm text-blue-100 capitalize 
            text-center flex gap-3'>connect <RadioTower /> </span>
          </StarBorder>
          </Link>

        </div>
      </SpotlightCard>

      <div className="relative w-full md:w-full h-[320px] md:h-[300px]
       overflow-hidden rounded-xl group  ">

        {/* Video Thumbnail Fallback (Optional for mobile/no autoplay) */}
        <img
          src={goal}
          alt="Video Preview"
          className="absolute inset-0 w-full h-full object-cover group-hover:hidden"
        />

        {/* Video Element */}
        <video
          className="absolute  w-full h-full object-cover hidden group-hover:block"
          src={goals}
          muted
          playsInline
          autoPlay
          loop
        />

        {/* Optional Overlay Text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center ">

          <Link
          to={'/problems-page/goal-tracker'}
            className="absolute bottom-4 right-4 z-20 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4
             py-2 rounded-lg shadow-lg transition-opacity duration-300">
            Explore Now
          </Link>

        </div>
      </div>

      <div>
         <Leaderboard/>
      </div>


    </div>
  );

}

export default ProbemCard