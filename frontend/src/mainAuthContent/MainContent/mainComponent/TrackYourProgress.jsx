import React, { useImperativeHandle, forwardRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGraphData } from '../../Api/fetchGraphData';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

 
const TrackYourProgress = forwardRef((props, ref) => {
  const { data: graphData = [], isLoading, refetch } = useQuery({
    queryKey: ['graphData'],
    queryFn: fetchGraphData,
    refetchOnWindowFocus: false,
  });

  // Expose an instant refetch for parent to call after submissions
  useImperativeHandle(ref, () => ({
    refetchGraphData: refetch,
  }));

  const totalScore = graphData.length > 0
    ? graphData[graphData.length - 1].score  // Last cumulative value
    : 0;

  return (
    <div className="bg-[#121212] text-white rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-5xl mx-auto mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-0.5">Track Your Progress</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Daily submission score of the last 7 days
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-3 sm:mt-0">
          <div className="text-center px-4">
            <div className="text-xs text-gray-400">Your Daily Progress</div>
            <div className="text-xl font-bold">Chart</div>
          </div>
          <div className="text-center px-4">
            <div className="text-xs text-gray-400">Overall Score</div>
            <div className="text-xl font-bold">{totalScore}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 h-[260px] sm:h-[300px] md:h-[350px] bg-[#1f1f1f] rounded-md p-2 sm:p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 animate-pulse">
            Loading graph...
          </div>
        ) : graphData && graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData.filter(d => d.day !== null)}
              margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="4 3" stroke="#242424" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#ccc", fontSize: 13 }}
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                }
                axisLine={{ stroke: "#444" }}
              />
              <YAxis
                tick={{ fill: "#ccc", fontSize: 13 }}
                axisLine={{ stroke: "#444" }}
                minTickGap={1}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#232323', border: '1px solid #444', color: "#ccc" }}
                labelStyle={{ color: "#00ff88" }}
                formatter={(value, name) =>
                  name === "score"
                    ? [`Score: ${value}`, "Cumulative"]
                    : [`${value}`, name]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00ff88"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#00ff88", strokeWidth: 2, fill: "#232323" }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 h-full">
            <ArrowTrendingUpIcon className="h-8 w-8 mb-2" />
            <p>No performance data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default TrackYourProgress;
