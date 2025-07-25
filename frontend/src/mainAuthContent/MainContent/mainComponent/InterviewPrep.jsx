import React, { useState } from "react";
import axiosClient from "../../../Utils/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Sparkles, Star, Award } from "lucide-react";
import usergif from "../mainAssets/userP.png";
import ThreeBackground from "../../../components/ThreeBackground";

// Enhanced Confetti Component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            scale: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            ease: "easeOut",
          }}
        >
          {i % 3 === 0 ? '🎉' : i % 3 === 1 ? '⭐' : '🎊'}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Success Badge
const SuccessBadge = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 
                 px-4 py-2 rounded-full mb-4 shadow-lg"
    >
      <Award className="w-5 h-5 text-white" />
      <span className="text-white font-semibold text-sm">Questions Generated!</span>
      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
    </motion.div>
  );
};

// Enhanced Accordion with better animations
const QuestionAccordion = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 
                 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex justify-between items-center text-left
                   hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 
                   transition-all duration-300 group"
      >
        <span className="text-white font-medium text-sm md:text-base leading-relaxed pr-4">
          <span className="text-green-400 font-bold mr-2">Q{index + 1}.</span>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="px-6 py-5 bg-gradient-to-r from-gray-900 to-black 
                       text-gray-100 text-sm whitespace-pre-line leading-relaxed
                       border-t border-gray-700"
          >
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InterviewPrep = () => {
  const [formData, setFormData] = useState({
    role: "",
    techStack: "",
    level: "Beginner",
  });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions(null);
    setError(null);
    setSuccess(false);
    setShowConfetti(false);

    try {
      const res = await axiosClient.post("/generate/question", formData);
      const raw = res.data?.data?.choices?.[0]?.message?.content;

      if (!raw) throw new Error("Invalid response from Gemini");

      const cleanText = raw.replace(/\*/g, "");
      const blocks = cleanText.split(/\n(?=\d+\.\s)/g);
      const parsed = blocks.map((block) => {
        const [q, ...rest] = block.split("\n");
        return {
          question: q.replace(/^[^:]+:\s*/, "").trim(),
          answer: rest
            .join("\n")
            .replace(/^[^:]+:\s*/, "")
            .trim(),
        };
      });

      setQuestions(parsed);
      setSuccess(true);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate interview questions. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen mt-10 text-white p-6 md:p-10 relative">
      <ThreeBackground />
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Form Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="  p-8 rounded-2xl 
                     border border-green-900 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black md:text-3xl 
                           bg-gradient-to-r from-zinc-400 via-white/90 to-green-300 
                           text-transparent bg-clip-text">
              Interview Prep Studio
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-300">
                Enter Your Targeted Role
              </label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Data Scientist"
                className="w-full px-4 py-4  border-b border-gray-600 rounded-b-lg 
                           outline-none   focus:ring-2 focus:ring-green-500/20
                           text-white placeholder-gray-400 transition-all duration-300
                           hover:border-gray-500"
                required
              />
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-300">
                 Tech Stack
              </label>
              <input
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, AWS"
                className="w-full px-4 py-4 border-b border-gray-600 rounded-b-lg 
                           outline-none focus:ring-2 focus:ring-green-500/20
                           text-white placeholder-gray-400 transition-all duration-300
                           hover:border-gray-500"
                required
              />
            </motion.div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                 Experience Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-4 border-b border-gray-600 rounded-b-lg 
                           outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                           text-white transition-all duration-300 hover:border-gray-500"
              >
                {difficultyLevels.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-gray-800">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Crafting Questions...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Questions</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section - Fixed Image Display */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl 
                     border border-gray-600 shadow-2xl"
        >
          {/* Default State - Show Image */}
          {!loading && !questions && !success && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                src={usergif}
                alt="Interview Prep"
                className="w-full max-w-md object-contain rounded-xl mb-6"
              />
              <h3 className="text-xl text-gray-300 mb-2">Ready to Practice?</h3>
              <p className="text-gray-400 text-sm">
                Fill out the form to generate personalized interview questions
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mb-6"
              />
              <h3 className="text-xl text-green-400 mb-4 font-semibold">
                Generating Your Questions...
              </h3>
              <div className="space-y-4 w-full max-w-md">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="animate-pulse bg-gradient-to-r from-gray-800 to-gray-700 
                               h-16 rounded-xl border border-gray-600"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Success State - Questions Generated */}
          {!loading && success && questions && (
            <div className="w-full">
              <div className="flex flex-col items-center mb-6">
                <SuccessBadge />
                <h3 className="text-2xl text-green-400 font-bold text-center">
                  Your Interview Questions
                </h3>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  {questions.length} questions generated for {formData.role}
                </p>
              </div>
              
              {/* Scrollable Questions Container */}
              <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-2 
                              scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
                {questions.map((q, idx) => (
                  <QuestionAccordion 
                    key={idx} 
                    q={q.question} 
                    a={q.answer} 
                    index={idx}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewPrep;
