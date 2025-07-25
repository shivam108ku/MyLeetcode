import { useState, useEffect } from 'react';
import axiosClient from '../../../Utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
      } finally {
        setLoading(false);
      }
    };
    if (problemId) {
      fetchSubmissions();
    }
  }, [problemId]);

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase?.();
    switch (normalized) {
      case 'accepted':
        return 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50';
      case 'wrong':
        return 'bg-rose-900/30 text-rose-300 border-rose-700/50';
      case 'error':
        return 'bg-amber-900/30 text-amber-300 border-amber-700/50';
      case 'pending':
        return 'bg-blue-900/30 text-blue-300 border-blue-700/50';
      default:
        return 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50';
    }
  };

  const getStatusIcon = (status) => {
    const normalized = status?.toLowerCase?.();
    switch (normalized) {
      case 'accepted':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'wrong':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatMemory = (memory) => {
    if (typeof memory !== 'number' || isNaN(memory)) return '-';
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-zinc-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 p-6">
        <div className="flex items-center space-x-3 p-4 bg-rose-950/50 border border-rose-800/30 rounded-lg">
          <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-rose-300 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Submission History</h2>
          <div className="flex items-center space-x-2 text-sm text-zinc-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-100 mb-2">No submissions yet</h3>
          <p className="text-zinc-400">Submit your solution to see your submission history here.</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Runtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Memory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Test Cases</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900 divide-y divide-zinc-800">
                {submissions.map((sub, index) => (
                  <tr key={sub._id || `${sub.language}_${index}`} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-100">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {sub.language || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        <span className="ml-1">
                          {sub.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : '-'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono">
                      {typeof sub.runtime === 'number' ? `${sub.runtime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono">
                      {formatMemory(sub.memory)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono">
                      <div className="flex items-center space-x-1">
                        <span className={sub.testCasesPassed === sub.testCasesTotal ? 'text-emerald-400' : 'text-rose-400'}>
                          {sub.testCasesPassed ?? '-'}
                        </span>
                        <span className="text-zinc-500">/</span>
                        <span>{sub.testCasesTotal ?? '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="inline-flex items-center px-3 py-1.5 border border-zinc-700 shadow-sm text-xs font-medium rounded-md text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-900 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/75 transition-opacity" onClick={() => setSelectedSubmission(null)}></div>
            
            <div className="relative bg-zinc-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-zinc-800">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      Submission Details
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {selectedSubmission.language}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</div>
                    <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusIcon(selectedSubmission.status)}
                      <span className="ml-1">{selectedSubmission.status}</span>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Runtime</div>
                    <div className="mt-1 text-sm font-mono text-zinc-200">
                      {typeof selectedSubmission.runtime === 'number' ? `${selectedSubmission.runtime}ms` : '-'}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Memory</div>
                    <div className="mt-1 text-sm font-mono text-zinc-200">
                      {formatMemory(selectedSubmission.memory)}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-3 text-center border border-zinc-700">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Test Cases</div>
                    <div className="mt-1 text-sm font-mono text-zinc-200">
                      {selectedSubmission.testCasesPassed ?? '-'}/{selectedSubmission.testCasesTotal ?? '-'}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {selectedSubmission.errorMessage && (
                  <div className="mb-4 p-4 bg-rose-950/50 border border-rose-800/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-rose-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-rose-300">Error Details</h4>
                        <p className="mt-1 text-sm text-rose-400">{selectedSubmission.errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code */}
                <div>
                  <h4 className="text-sm font-medium text-zinc-200 mb-2">Source Code</h4>
                  <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                    <pre className="p-4 text-sm text-zinc-100 overflow-x-auto">
                      <code>{selectedSubmission.code ?? '// Code not available'}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
