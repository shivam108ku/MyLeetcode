import React, { useState, useEffect, useRef } from 'react';
import { Plus, Target, CheckCircle, Clock, TrendingUp, Code, Brain, Sparkles } from 'lucide-react';
import ThreeBackground from '../../../components/ThreeBackground';
import { motion } from "framer-motion";

const STORAGE_KEY = 'dsa-daily-goals';
const STREAK_KEY = 'dsa-streak';
const LAST_COMPLETE_KEY = 'dsa-last-completion';

// Util: get today's date as YYYY-MM-DD
const todayStr = () => (new Date()).toISOString().slice(0, 10);

const useLocalStorageGoal = () => {
  // Get and parse local storage (if <24h old)
  const getGoal = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      const data = JSON.parse(stored);
      if (!data.goal || !data.timestamp) return null;
      // If it's from another day, expire it
      if (new Date(data.goal.date).toISOString().slice(0,10) !== todayStr()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data.goal;
    } catch { 
      return null;
    }
  };
  // Save goal
  const saveGoal = (goal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal, timestamp: new Date() }));
  };
  return { getGoal, saveGoal };
};

// Goal Setter Component
function GoalSetter({ onCreateGoal }) {
  const [dsaGoal, setDsaGoal] = useState(3);
  const [challengeGoal, setChallengeGoal] = useState(2);

  return (
    <div className="min-h-screen flex items-center justify-center p-4  ">
      <div className="rounded-2xl border-2 border-green-950 shadow-xl bg-zinc-900/90 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 text-green-100 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">Set Your Daily Goals</h2>
          <p className="text-zinc-100">How many will you solve today?</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-2">DSA Problems</label>
            <input
              type="number"
              min="1"
              max="20"
              value={dsaGoal}
              onChange={(e) => setDsaGoal(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border-2 border-zinc-700 rounded-lg bg-zinc-950 text-white
               focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-100 mb-2">Coding Challenges</label>
            <input
              type="number"
              min="1"
              max="20"
              value={challengeGoal}
              onChange={(e) => setChallengeGoal(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border-2 border-zinc-700 rounded-lg bg-zinc-950 text-white
               focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => onCreateGoal(dsaGoal, challengeGoal)}
            className="w-full border border-green-700 bg-zinc-700 text-white py-3 
            rounded-b-lg font-medium hover:bg-zinc-950
             transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Start Today's Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

// Progress Card Component
function ProgressCard({ title, completed, total, progress, icon }) {
  return (
    <div className="rounded-xl border-2 border-zinc-700 p-6 bg-gradient-to-tr
     from-zinc-900 to-green-950 hover:shadow-lg
      hover:border-green-400 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-green-200">{icon}</div>
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-zinc-100">{completed}/{total}</span>
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-3 mb-2">
        <div
          className="bg-gradient-to-r from-green-400 to-green-700 h-3 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-zinc-500">
        <span>{Math.round(progress)}% Complete</span>
        <span>{Math.max(0, total - completed)} left</span>
      </div>
    </div>
  );
}

// Problem List Component
function ProblemList({ problems, onToggleProblem }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-zinc-900 border-green-200';
      case 'Medium': return 'text-yellow-300 bg-yellow-900 border-yellow-200';
      case 'Hard': return 'text-red-300 bg-red-900 border-red-200';
      default: return 'text-zinc-300 bg-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="rounded-xl border-2 border-zinc-700 p-6 bg-zinc-900/90">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Today's Problems</h3>
      {problems.length === 0 ? (
        <div className="text-center py-8 text-zinc-100">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No problems added yet. Start by adding your first problem!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              whileHover={{ scale: 1.01, boxShadow: '0 4px 32px #22c55e44' }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                problem.completed
                  ? 'bg-zinc-950 border-green-900 shadow-green-800/40'
                  : 'bg-zinc-800 border-zinc-700 hover:border-green-400'
              }`}
              onClick={() => onToggleProblem(problem.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      problem.completed ? 'text-green-600 animate-pulse' : 'text-zinc-400'
                    }`}
                  />
                  <div>
                    <h4 className={`font-medium ${
                      problem.completed ? 'text-green-100 line-through italic' : 'text-zinc-100'
                    }`}>
                      {problem.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded border ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                      <span className="px-2 py-1 text-xs text-zinc-100 bg-zinc-950 rounded-lg border border-green-800">{problem.type}</span>
                    </div>
                  </div>
                </div>
                {problem.completed && problem.completedAt && (
                  <span className="text-xs text-green-100">{new Date(problem.completedAt).toLocaleTimeString()}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add Problem Form Component
function AddProblemForm({ newProblem, setNewProblem, onAddProblem }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProblem();
  };

  return (
    <div className="rounded-xl border-2 border-zinc-700 p-6 bg-zinc-900/90">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-green-100" />
        Add Problem
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Problem title..."
          value={newProblem.title}
          onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
          className="w-full px-3 py-2 border-2 border-zinc-700 rounded-lg bg-zinc-950
           focus:border-green-500 focus:outline-none transition-colors text-white"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={newProblem.difficulty}
            onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
            className="px-3 py-2 border-2 border-zinc-700 rounded-lg bg-zinc-950 focus:border-green-500
             focus:outline-none transition-colors text-white"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={newProblem.type}
            onChange={(e) => setNewProblem({ ...newProblem, type: e.target.value })}
            className="px-3 py-2 border-2 border-zinc-700 rounded-lg bg-zinc-950 focus:border-green-500
             focus:outline-none transition-colors text-white"
          >
            <option value="DSA">DSA</option>
            <option value="Coding Challenge">Coding Challenge</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!newProblem.title.trim()}
          className="w-full bg-gradient-to-r from-zinc-700   to-yellow-300 text-white py-2 rounded-lg font-medium
           hover:from-green-700 hover:to-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Add Problem
        </button>
      </form>
    </div>
  );
}

// Main Goal Tracker Component
function GoalTracker() {
  const { getGoal, saveGoal } = useLocalStorageGoal();
  // Set initial state
  const [goal, setGoal] = useState(() => getGoal());
  const [showGoalSetter, setShowGoalSetter] = useState(!goal);
  const [newProblem, setNewProblem] = useState({ title: '', difficulty: 'Medium', type: 'DSA' });
  const today = new Date().toLocaleDateString();
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(STREAK_KEY) || 0));
  const [celebrating, setCelebrating] = useState(false);

  // Save to storage whenever goal fundamentally changes (problems, completions, etc)
  useEffect(() => { 
    if (goal) saveGoal(goal); 
  }, [goal, saveGoal]);

  // Handle streak/celebration (only when all problems are completed and not celebrated today)
  useEffect(() => {
    if (!goal || goal.problems.length === 0) return;
    // Is fully completed?
    const allCompleted = goal.problems.length > 0 && goal.problems.every(p => p.completed);
    // Only celebrate and increment streak if not already done for today
    const lastComplete = localStorage.getItem(LAST_COMPLETE_KEY);
    if (allCompleted && lastComplete !== todayStr()) {
      setCelebrating(true);
      // Increment streak
      setStreak(s => {
        const newStreak = s + 1;
        localStorage.setItem(STREAK_KEY, newStreak);
        localStorage.setItem(LAST_COMPLETE_KEY, todayStr());
        return newStreak;
      });
      setTimeout(() => setCelebrating(false), 2200);
    }
  }, [goal]);

  // Creating a new goal resets everything
  const createGoal = (dsaProblems, codingChallenges) => {
    setGoal({ dsaProblems, codingChallenges, date: todayStr(), problems: [] });
    setShowGoalSetter(false);
  };

  const addProblem = () => {
    if (!newProblem.title.trim() || !goal) return;
    setGoal({
      ...goal,
      problems: [...goal.problems, {
        id: Date.now().toString() + Math.random(),
        title: newProblem.title,
        difficulty: newProblem.difficulty,
        type: newProblem.type,
        completed: false,
      }]
    });
    setNewProblem({ title: '', difficulty: 'Medium', type: 'DSA' });
  };

  const toggleProblem = (id) => {
    if (!goal) return;
    setGoal(g => ({
      ...g,
      problems: g.problems.map(p =>
        p.id === id
          ? { ...p, completed: !p.completed, completedAt: !p.completed ? new Date() : undefined }
          : p
      )
    }));
  };

  const resetGoal = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGoal(null);
    setShowGoalSetter(true);
  };

  if (showGoalSetter) return <GoalSetter onCreateGoal={createGoal} />;
  if (!goal) return null;

  // Analytics
  const dsaCompleted = goal.problems.filter(p => p.type === 'DSA' && p.completed).length;
  const challengesCompleted = goal.problems.filter(p => p.type === 'Coding Challenge' && p.completed).length;
  const dsaProgress = Math.min((dsaCompleted / Math.max(goal.dsaProblems, 1)) * 100, 100);
  const challengeProgress = Math.min((challengesCompleted / Math.max(goal.codingChallenges, 1)) * 100, 100);
  const fullyCompleted = goal.problems.length > 0 &&
    dsaCompleted >= goal.dsaProblems && challengesCompleted >= goal.codingChallenges;

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none"><ThreeBackground /></div>
      {celebrating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl duration-200 animate-fade-in">
          <Sparkles className="w-24 h-24 text-yellow-300 animate-bounce" />
          <span className="text-4xl font-black mt-2 drop-shadow-lg">Daily Goal Complete!</span>
          <span className="text-xl mt-4 text-white bg-green-800/80 px-6 py-2 rounded-full">Streak: {streak} {streak === 1 ? 'day' : 'days'}</span>
        </div>
      )}
      <div className="max-w-4xl mx-auto py-4 sm:py-12 px-4">
        <header className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow-lg">Daily DSA Tracker</h1>
          <p className="text-zinc-100 text-base">Track your daily coding progress • <b>{today}</b></p>
          {streak > 1 && <p className="text-green-400 text-sm">🔥 {streak}-day completion streak!</p>}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard
            title="DSA Problems"
            completed={dsaCompleted}
            total={goal.dsaProblems}
            progress={dsaProgress}
            icon={<Brain className="w-6 h-6" />}
          />
          <ProgressCard
            title="Coding Challenges"
            completed={challengesCompleted}
            total={goal.codingChallenges}
            progress={challengeProgress}
            icon={<Code className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProblemList
              problems={goal.problems}
              onToggleProblem={toggleProblem}
            />
          </div>
          <div className="space-y-6">
            <AddProblemForm
              newProblem={newProblem}
              setNewProblem={setNewProblem}
              onAddProblem={addProblem}
            />
            <div className="rounded-xl border-2 border-zinc-700 p-6 bg-gradient-to-bl from-zinc-900 to-green-950/60">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Daily Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-zinc-100">Total Problems</span><span className="font-medium">{goal.problems.length}</span></div>
                <div className="flex justify-between"><span className="text-zinc-100">Completed</span><span className="font-medium text-green-300">{dsaCompleted + challengesCompleted}</span></div>
                <div className="flex justify-between"><span className="text-zinc-100">Success Rate</span><span className="font-medium">{goal.problems.length > 0 ? Math.round(((dsaCompleted + challengesCompleted) / goal.problems.length) * 100) : 0}%</span></div>
                <div className="flex justify-between"><span className="text-zinc-100">Time Saved</span><span className="font-medium">{Math.max(0, (goal.problems.length * 25) / 60).toFixed(2)} hrs</span></div>
                <div className="flex justify-between"><span className="text-zinc-100">Daily Streak</span><span className="font-medium">{streak} 🔥</span></div>
              </div>
              <button
                onClick={resetGoal}
                className="w-full mt-4 px-4 py-2 text-sm text-zinc-100 bg-zinc-900
                   border border-zinc-700 rounded-lg hover:bg-green-800/60 transition-colors"
              >
                Reset Today's Goal
              </button>
              {fullyCompleted &&
                <div className="mt-4 w-full text-center">
                  <span className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full font-bold shadow shadow-green-900/40 animate-pulse">
                    <CheckCircle className="w-5 h-5 text-white animate-ping" />
                    Completed Badge
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;
