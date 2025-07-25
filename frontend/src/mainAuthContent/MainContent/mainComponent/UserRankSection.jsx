import React, { useState } from 'react';
import userGif from '../mainAssets/user.gif';
import userGifPaused from '../mainAssets/profile.png';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserStats } from '../../Api/problemSolvedAPi';

const UserRankSection = () => {
  const lecturesCompleted = 0;
  const totalLectures = 2;
  const totalCodingProblems = 15;

  const [isPlaying, setIsPlaying] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const queryClient = useQueryClient();

  // ✅ React Query to fetch stats
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['userStats'],
    queryFn: fetchUserStats,
    refetchOnWindowFocus: false,
  });

  const handleClick = async () => {
    setIsPlaying(true);
    setIsUpdating(true);
    setGifKey(prev => prev + 1);

    try {
      // Refetch user stats data
      await refetch();
      
      // Optional: Also invalidate related queries (like pie chart data)
      queryClient.invalidateQueries(['userSubmissions']);
      queryClient.invalidateQueries(['graphData']);
      
    } catch (error) {
      console.error('Error updating stats:', error);
    }

    // Keep GIF playing for visual feedback
    setTimeout(() => {
      setIsPlaying(false);
      setIsUpdating(false);
    }, 4200); // Reduced to 3 seconds for better UX
  };
  
  if (isLoading) return (
    <div className="bg-[#121212] text-white rounded-xl shadow-lg w-full max-w-[95%] mx-auto p-10 mt-1">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-42 h-42 bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="bg-[#121212] text-white rounded-xl shadow-lg w-full max-w-[95%] mx-auto p-10 mt-1">
      <p className="text-red-400 text-center">Error loading stats</p>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleClick}
          className="bg-red-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#121212] text-white rounded-xl shadow-lg w-full max-w-[95%] mx-auto p-10 mt-1">
      {/* Avatar */}
      <div className="w-42 h-42 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden">
        <img
          key={gifKey}
          src={isPlaying ? userGif : userGifPaused}
          alt="User Avatar"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Update Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleClick}
          disabled={isUpdating}
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-xs rounded-full 
            shadow transition-all duration-300 ${
              isPlaying || isUpdating 
                ? 'opacity-0 invisible' 
                : 'opacity-100 visible'
            } ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isUpdating ? 'Updating...' : 'Click to Update Data'}
        </button>
      </div>

      {/* Loading indicator when updating */}
      {isUpdating && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
        </div>
      )}

      {/* Stats */}
      <div className='flex mt-8 justify-around items-center'>
        <div className="text-center h-14 w-40 rounded-xl border-green-700 p-1 border">
          <p className="text-sm text-gray-400">Lectures Progress</p>
          <p className="font-bold">{lecturesCompleted} / {totalLectures}</p>
        </div>

        <div className="text-center h-14 w-40 rounded-xl border border-green-700 p-1">
          <p className="text-sm text-gray-400">Coding Problems</p>
          <p className={`font-bold transition-all duration-500 ${
            isUpdating ? 'animate-pulse' : ''
          }`}>
            {stats?.problemsSolved || 0} / {totalCodingProblems}
          </p>
        </div>
      </div>

      {/* Optional: Last updated timestamp */}
      {stats?.lastUpdated && (
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserRankSection;
