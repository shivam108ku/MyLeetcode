import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../../Utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-zinc-900 text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-zinc-50 tracking-tight">Create New Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <section className="bg-zinc-800/70 ring-1 ring-zinc-700 rounded-lg px-6 py-8 shadow">
          <h2 className="text-xl font-semibold mb-6 text-zinc-200">Basic Information</h2>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-zinc-300 mb-1 font-medium">Title</label>
              <input
                {...register('title')}
                className={`w-full bg-zinc-950 border border-zinc-700 placeholder-zinc-500 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 transition ${
                  errors.title ? 'border-rose-500' : ''
                }`}
                placeholder="Give your problem a title"
                autoFocus
              />
              {errors.title && (
                <span className="mt-1 block text-xs text-rose-400">{errors.title.message}</span>
              )}
            </div>
            {/* Description */}
            <div>
              <label className="block text-zinc-300 mb-1 font-medium">Description</label>
              <textarea
                {...register('description')}
                className={`w-full bg-zinc-950 border border-zinc-700 placeholder-zinc-500 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-zinc-100 transition resize-y ${
                  errors.description ? 'border-rose-500' : ''
                }`}
                rows={5}
                placeholder="Describe the problem here"
              />
              {errors.description && (
                <span className="mt-1 block text-xs text-rose-400">{errors.description.message}</span>
              )}
            </div>
            <div className="flex gap-6">
              <div className="w-1/2">
                <label className="block text-zinc-300 mb-1 font-medium">Difficulty</label>
                <select
                  {...register('difficulty')}
                  className={`w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.difficulty ? 'border-rose-500' : ''
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <span className="mt-1 block text-xs text-rose-400">{errors.difficulty.message}</span>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-zinc-300 mb-1 font-medium">Tag</label>
                <select
                  {...register('tags')}
                  className={`w-full bg-zinc-950 border border-zinc-700 text-zinc-100 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.tags ? 'border-rose-500' : ''
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
                {errors.tags && (
                  <span className="mt-1 block text-xs text-rose-400">{errors.tags.message}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Test Cases */}
        <section className="bg-zinc-800/70 ring-1 ring-zinc-700 rounded-lg px-6 py-8 shadow">
          <h2 className="text-xl font-semibold mb-6 text-zinc-200">Test Cases</h2>
          {/* Visible Test Cases */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-zinc-400 font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="rounded bg-blue-600/80 hover:bg-blue-700 px-3 py-1 text-sm font-medium text-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 transition"
              >
                + Add Visible Case
              </button>
            </div>
            <div className="space-y-5">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 space-y-2 relative shadow">
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => removeVisible(index)}
                    className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-xs px-2 py-1 rounded shadow text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                  >Remove</button>
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-400 transition resize-y"
                    rows={2}
                  />
                  {(errors.visibleTestCases?.[index]?.input ||
                    errors.visibleTestCases?.[index]?.output ||
                    errors.visibleTestCases?.[index]?.explanation) && (
                      <div className="space-y-1 mt-1 text-xs text-rose-400">
                        {errors.visibleTestCases?.[index]?.input?.message}
                        {errors.visibleTestCases?.[index]?.output?.message}
                        {errors.visibleTestCases?.[index]?.explanation?.message}
                      </div>
                    )
                  }
                </div>
              ))}
              {errors.visibleTestCases?.message && (
                <span className="block text-xs text-rose-400">{errors.visibleTestCases.message}</span>
              )}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-zinc-400 font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="rounded bg-blue-600/80 hover:bg-blue-700 px-3 py-1 text-sm font-medium text-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 transition"
              >
                + Add Hidden Case
              </button>
            </div>
            <div className="space-y-5">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 space-y-2 relative shadow">
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => removeHidden(index)}
                    className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-xs px-2 py-1 rounded shadow text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                  >Remove</button>
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="w-full bg-zinc-800/80 border border-zinc-700 rounded px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  {(errors.hiddenTestCases?.[index]?.input ||
                    errors.hiddenTestCases?.[index]?.output) && (
                      <div className="space-y-1 mt-1 text-xs text-rose-400">
                        {errors.hiddenTestCases?.[index]?.input?.message}
                        {errors.hiddenTestCases?.[index]?.output?.message}
                      </div>
                    )
                  }
                </div>
              ))}
              {errors.hiddenTestCases?.message && (
                <span className="block text-xs text-rose-400">{errors.hiddenTestCases.message}</span>
              )}
            </div>
          </div>
        </section>

        {/* Code Templates */}
        <section className="bg-zinc-800/70 ring-1 ring-zinc-700 rounded-lg px-6 py-8 shadow">
          <h2 className="text-xl font-semibold mb-6 text-zinc-200">Code Templates</h2>
          <div className="space-y-8">
            {["C++", "Java", "JavaScript"].map((lang, index) => (
              <div key={lang} className="space-y-3">
                <h3 className="font-medium text-zinc-400 mb-2">{lang}</h3>
                <div>
                  <label className="block text-zinc-300 mb-1">Initial Code</label>
                  <textarea
                    {...register(`startCode.${index}.initialCode`)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-100 font-mono resize-y focus:ring-2 focus:ring-blue-400 transition outline-none"
                    rows={5}
                  />
                  {errors.startCode?.[index]?.initialCode && (
                    <span className="block text-xs mt-1 text-rose-400">
                      {errors.startCode?.[index]?.initialCode?.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Reference Solution</label>
                  <textarea
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-100 font-mono resize-y focus:ring-2 focus:ring-blue-400 transition outline-none"
                    rows={5}
                  />
                  {errors.referenceSolution?.[index]?.completeCode && (
                    <span className="block text-xs mt-1 text-rose-400">
                      {errors.referenceSolution?.[index]?.completeCode?.message}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-lg font-semibold text-zinc-50 shadow focus-visible:ring-2 focus-visible:ring-blue-400 transition"
        >
          Create Problem
        </button>
      </form>
    </div>
  );
}
export default AdminPanel;
