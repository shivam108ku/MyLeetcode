/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "../../Api/problemApi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const ProblemArea = () => {
  const { data: problems = [], isLoading } = useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
  });

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch =
      filters.tag === "all" || problem.tags?.includes(filters.tag);
    return difficultyMatch && tagMatch;
  });

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[90%] sm:w-[80%] lg:w-[70%] mx-auto mt-10 rounded-2xl p-4 sm:p-8 border border-slate-700/50"
    >
      <h3 className="text-white text-3xl font-black mb-6">DSA Problems List</h3>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <select
          className="select select-bordered bg-zinc-900 text-white border-slate-600 focus:outline-none"
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="select select-bordered bg-zinc-900 text-white border-slate-600 focus:outline-none"
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        >
          <option value="all">All Tags</option>
          <option value="array">Array</option>
          <option value="dp">DP</option>
          <option value="graph">Graph</option>
          <option value="linkedList">Linked List</option>
        </select>
      </motion.div>

      {/* Problem Cards */}
      {isLoading ? (
        <p className="text-white text-center text-xl animate-pulse">
          Loading problems...
        </p>
      ) : filteredProblems.length === 0 ? (
        <p className="text-white text-center text-lg">
          No problems found with selected filters.
        </p>
      ) : (
        <AnimatePresence>
          <motion.div layout className="space-y-3">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem._id}
                onClick={() =>
                  navigate(`/problems-page/problems/${problem._id}`)
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-slate-800 shadow-md transition duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      index % 2 === 0
                        ? "from-orange-500 to-amber-500"
                        : index % 3 === 0
                        ? "from-green-500 to-emerald-500"
                        : "from-blue-500 to-indigo-500"
                    }`}
                  ></div>
                  <span className="text-white font-medium text-sm">
                    {problem.title}
                  </span>
                  <span className="text-slate-400 text-xs capitalize">
                    {problem.tags?.[0] || "misc"}
                  </span>
                </div>
                <span
                  className={`font-semibold text-sm capitalize ${
                    problem.difficulty === "easy"
                      ? "text-green-400"
                      : problem.difficulty === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ProblemArea;
