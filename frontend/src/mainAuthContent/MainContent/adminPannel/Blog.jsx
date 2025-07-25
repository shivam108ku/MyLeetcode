import React, { useState } from 'react';
import axiosClient from '../../../Utils/axiosClient'; // your axios setup with auth headers

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    setError(null);

    try {
      const payload = {
        title,
        content,
        tags: tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      };

      const res = await axiosClient.post('/blog/create', payload);

      setNotice('✅ Blog created successfully!');
      setTitle('');
      setContent('');
      setTags('');
    } catch (err) {
      setError(`❌ ${err.response?.data || 'Failed to create blog.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Create New Blog</h1>

      {notice && <div className="alert alert-success mb-4">{notice}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="label font-medium">Title</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="label font-medium">Content</label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[180px]"
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="label font-medium">
            Tags <span className="text-xs text-gray-500">(comma separated)</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. JavaScript, React, Backend"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary btn-wide"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Create Blog'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
