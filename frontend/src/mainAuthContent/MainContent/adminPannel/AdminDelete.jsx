import { useEffect, useState } from 'react';
import axiosClient from '../../../Utils/axiosClient';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/allProblems');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-medium">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error shadow-lg max-w-4xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error!</h3>
            <div className="text-xs">{error}</div>
          </div>
          <button className="btn btn-sm" onClick={fetchProblems}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Manage Problems</h1>
            <p className="text-gray-600 mt-1">View and delete coding problems</p>
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No problems found</h3>
            <p className="text-gray-500 mt-1">There are currently no problems to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Title</th>
                  <th className="w-32">Difficulty</th>
                  <th className="w-48">Tags</th>
                  <th className="w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="hover:bg-base-100 transition-colors">
                    <td className="text-center font-medium text-gray-500">{index + 1}</td>
                    <td>
                      <div className="font-medium">{problem.title}</div>
                    </td>
                    <td>
                      <span className={`badge font-medium ${
                        problem.difficulty === 'Easy' 
                          ? 'badge-success text-white' 
                          : problem.difficulty === 'Medium' 
                            ? 'badge-warning text-white' 
                            : 'badge-error text-white'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(problem.tags) ? (
                          problem.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="badge badge-outline badge-sm">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="badge badge-outline badge-sm">
                            {problem.tags}
                          </span>
                        )}
                        {Array.isArray(problem.tags) && problem.tags.length > 2 && (
                          <span className="badge badge-ghost badge-sm">
                            +{problem.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDelete(problem._id)}
                        className="btn btn-error btn-sm text-white hover:bg-red-700"
                        aria-label={`Delete ${problem.title}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelete;