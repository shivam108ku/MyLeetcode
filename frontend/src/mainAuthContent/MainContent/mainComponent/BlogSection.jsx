import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../../Api/blogApi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';

const BlogSection = () => {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    enabled: !!user,
    staleTime: 1000 * 60 * 60 * 5, // 5 hours
  });

  if (!user) return <p className="text-center text-white">Please login to see your wallet and blogs</p>;
  if (isLoading) return <p className="text-center text-white">Loading blogs...</p>;
  if (isError) return <p className="text-center text-red-400">Error: {error.message}</p>;

  return (
    <div className="rounded-2xl p-4 sm:p-6 border border-zinc-700 w-full max-w-4xl mx-auto mt-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg sm:text-xl">
          Smart<span className="text-yellow-600">Code</span> Tips
        </h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
        {Array.isArray(data) &&
          data
            .filter((blog) => blog?.tittle && blog?.content)
            .map((blog, index) => (
              <motion.div
                key={blog._id}
                className="p-3 sm:p-4 bg-zinc-800 hover:bg-slate-800/40 rounded-xl border border-slate-600/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 rounded-xl flex items-center justify-center border border-yellow-500/20">
                    <span className="text-yellow-300 font-bold text-xs text-center truncate px-1">
                      {blog.tittle?.slice(0, 4) || "Blog"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-1">
                    <p className="text-white font-semibold text-sm sm:text-base mb-1 truncate">
                      {blog.tittle || "Untitled"}
                    </p>
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3">
                      {blog.content || "No content available."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      <p className="mt-6 text-xs text-slate-500 text-right border-t border-slate-700/30 pt-3">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default BlogSection;
