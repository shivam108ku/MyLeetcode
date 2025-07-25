import React from 'react';
import { Link } from 'react-router';
 

import {
  LayoutDashboard,
  Code2,
  Target,
  Users2,
  BringToFront ,
  LandPlot  ,
  TrainFront,
  ScanBarcode 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-20 bg-zinc-900 text-white p-3 
    border-r border-gray-700 z-50 flex flex-col gap-10 items-center pt-12">
      <Link to="/problems-page" className="flex flex-col items-center group">
        <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Dashboard</span>
      </Link>

      <Link to="/problems-page/problems" className="flex flex-col items-center group">
        <Code2 className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Problems</span>
      </Link>

      <Link to="/problems-page/feed" className="flex flex-col items-center group">
        <BringToFront  className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Feed</span>
      </Link>

       <Link to="/problems-page/algo-visualiser" className="flex flex-col items-center group">
        <ScanBarcode className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
        <span className="text-xs mt-1 text-gray-400 text-center group-hover:text-white">Algo Visualiser</span>
      </Link>

       <Link to="/problems-page/group-coding" className="flex flex-col items-center group">
        <Users2 className="w-5 h-5 text-gray-400 group-hover:text-pink-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Group</span>
      </Link>

      <Link to="/problems-page/goal-tracker" className="flex flex-col items-center group">
        <Target className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Goals</span>
      </Link>

      <Link to="/problems-page/interview-prep" className="flex flex-col items-center group">
        <TrainFront  className="w-5 h-5 text-gray-400 group-hover:text-violet-900" />
        <span className="text-xs mt-1 text-gray-400 text-center group-hover:text-white">Interview Prep</span>
      </Link>

      <Link to="/problems-page/help" className="flex flex-col items-center group">
        <LandPlot  className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
        <span className="text-xs mt-1 text-gray-400 group-hover:text-white">Dsa Arena</span>
      </Link>
    </div>
  );
};

export default Sidebar;







