import React, { useEffect, useState } from 'react';
import axiosClient from '../../../Utils/axiosClient';
import post from '../mainAssets/post.gif';
 
import { 
  Heart, 
  MessageCircle,
  Send,
  User,
  MoreHorizontal,
  Share,
  Bookmark,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await axiosClient.post('/feed/post', 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await axiosClient.post(`/feed/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter(id => id !== userId)
                  : [...post.likes, userId]
              }
            : post
        )
      );
    } catch (err) {
      console.error('Like failed:', err);
      fetchPosts();
    }
  };

  const submitComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    try {
      await axiosClient.post(`/feed/${postId}/comment`,
        { content: newComment[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosClient.get(`/feed/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => ({ ...prev, [postId]: res.data }));
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error('Get comments failed:', err);
    }
  };

  const toggleComments = (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments(prev => ({ ...prev, [postId]: false }));
    } else {
      fetchComments(postId);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Main Container with consistent width */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
          
          {/* Main Feed - Takes most space */}
          <div className="lg:col-span-8">
            {/* Sticky Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-0 z-20 backdrop-blur-xl bg-black/40 border border-purple-500/20 rounded-2xl p-6 mb-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-zinc-400 to-zinc-100 bg-clip-text text-transparent">
                  Share Your Thoughts
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>
            </motion.div>

            {/* Post Composer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6 shadow-xl"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r
                   from-green-600 to-black flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <textarea
                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none text-lg leading-relaxed"
                    placeholder="What's on your mind? ✨"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-3">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        {content.length}/280
                      </span>
                      <button
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                          content.trim() 
                            ? 'bg-gradient-to-r cursor-pointer from-green-600 to-zinc-950 hover:from-zinc-950 hover:to-green-600 text-white shadow-lg transform hover:scale-105' 
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handlePost}
                        disabled={!content.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin"></div>
                </div>
              ) : posts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-gray-400">Be the first to share something amazing!</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {posts.map((postItem, index) => (
                    <motion.div
                      key={postItem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-400/40"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-zinc-500 to-zinc-950 flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {postItem.author?.firstName || 'Anonymous'}
                              </span>
                              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                              <span className="text-gray-400 text-sm">
                                {new Date(postItem.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">@{postItem.author?.firstName?.toLowerCase() || 'user'}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-6">
                        <p className="text-white text-lg leading-relaxed">{postItem.content}</p>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-6">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                            onClick={() => toggleComments(postItem._id)}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{comments[postItem._id]?.length || 0}</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 transition-colors ${
                              postItem.likes.includes(userId) 
                                ? 'text-red-500' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                            onClick={() => toggleLike(postItem._id)}
                          >
                            <Heart 
                              className={`w-5 h-5 ${postItem.likes.includes(userId) ? 'fill-current' : ''}`} 
                            />
                            <span className="text-sm font-medium">{postItem.likes.length}</span>
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
                          >
                            
                            
                          </motion.button>
                        </div>

                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                           
                        </motion.button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {expandedComments[postItem._id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-white/10"
                          >
                            {comments[postItem._id]?.length > 0 ? (
                              <div className="space-y-4 mb-4">
                                {comments[postItem._id].map((comment) => (
                                  <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 p-3 rounded-xl bg-white/5"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-grow">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white text-sm">
                                          {comment.author?.firstName || 'User'}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                          {new Date(comment.createdAt).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-gray-300 text-sm">{comment.content}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-4">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No comments yet. Be the first to comment!</p>
                              </div>
                            )}
                            
                            {/* Comment Input */}
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-grow flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  className="flex-grow bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-purple-400 transition-colors text-white placeholder-gray-400"
                                  value={newComment[postItem._id] || ''}
                                  onChange={(e) =>
                                    setNewComment({ ...newComment, [postItem._id]: e.target.value })
                                  }
                                  onKeyPress={(e) => e.key === 'Enter' && submitComment(postItem._id)}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`p-2 rounded-full transition-colors ${
                                    newComment[postItem._id]?.trim()
                                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                                      : 'bg-gray-700 text-gray-500'
                                  }`}
                                  onClick={() => submitComment(postItem._id)}
                                  disabled={!newComment[postItem._id]?.trim()}
                                >
                                  <Send className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Sidebar - Consistent with main content */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">

              {/* Animated GIF */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-950 to-zinc-950 
                  border border-purple-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-center">
                  <img 
                    className="w-full h-auto rounded-xl shadow-lg"
                    src={post} 
                    alt="Animated post illustration" 
                  />
                  <p className="text-gray-400 text-sm mt-3">Share your thoughts with the world!</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
