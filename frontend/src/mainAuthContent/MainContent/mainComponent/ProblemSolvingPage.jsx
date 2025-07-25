import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../../../Utils/axiosClient";
import SubmissionHistory from "../mainComponent/SubmmissionHistory";
import ChatAi from "../mainComponent/ChatAi";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const langMap = {
  java: "Java",
  javascript: "JavaScript",
  cpp: "c++",
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy": return "text-green-500";
    case "medium": return "text-yellow-500";
    case "hard": return "text-red-500";
    default: return "text-gray-500";
  }
};

const getLanguageForMonaco = (lang) => lang;

// Helper: maps frontend language keys to backend language strings
const languageBackendMap = {
  javascript: "javascript",
  java: "java",
  cpp: "c++",
};

const findStartCode = (startCodes, selectedLang) => {
  if (!startCodes || !Array.isArray(startCodes)) return "";

  const backendLang = languageBackendMap[selectedLang.toLowerCase()] || selectedLang.toLowerCase();

  const found = startCodes.find(
    (sc) => sc.language.toLowerCase() === backendLang
  );

  return found?.initialCode || "";
};

export default function ProblemPage() {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const [showConfetti, setShowConfetti] = useState(false);

  const editorRef = useRef(null);
  const { problemId } = useParams();
  const { width, height } = useWindowSize();

  const { handleSubmit } = useForm();

  // Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);

        // Set initial code for current language
        const initialCode = findStartCode(response.data.startCode, selectedLanguage);
        setCode(initialCode);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
    // eslint-disable-next-line
  }, [problemId]);

  // Update code when selectedLanguage or problem changes
  useEffect(() => {
    if (problem) {
      const initialCode = findStartCode(problem.startCode, selectedLanguage);
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  // Confetti on all test cases passed (run)
  useEffect(() => {
    if (
      Array.isArray(runResult) &&
      runResult.length > 0 &&
      runResult.every(res => res.status?.description === "Accepted")
    ) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [runResult]);

  // Confetti on successful submission
  useEffect(() => {
    if (submitResult?.accepted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [submitResult]);

  const handleEditorChange = (value) => setCode(value || "");
  const handleEditorDidMount = (editor) => { editorRef.current = editor; };
  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(response.data);
      setActiveRightTab("testcase");
    } catch (error) {
      setRunResult({ success: false, error: "Internal server error" });
      setActiveRightTab("testcase");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        { code, language: selectedLanguage }
      );
      setSubmitResult(response.data);
      setActiveRightTab("result");
    } catch (error) {
      setSubmitResult(null);
      setActiveRightTab("result");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <span className="loading loading-spinner loading-lg text-blue-300"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-[92vh] w-[90%] max-w-screen-2xl mx-auto px-2 md:px-10 py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 gap-3 transition-colors">
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={2500}
            style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
            recycle={false}
          />
        </div>
      )}

      {/* LEFT PANEL */}
      <section className="flex flex-col min-h-0 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <nav className="flex items-center gap-1 md:gap-5 px-2 md:px-5 border-b border-zinc-800 h-14">
          {[
            { tab: "description", label: "Description" },
            { tab: "editorial", label: "Editorial" },
            { tab: "solutions", label: "Solutions" },
            { tab: "submissions", label: "Submissions" },
            { tab: "chatAI", label: "ChatAI" },
          ].map(({ tab, label }) => (
            <button
              key={tab}
              className={`group px-3 h-9 flex items-center gap-1 text-sm font-semibold rounded-t-lg transition-all ${
                activeLeftTab === tab
                  ? "text-yellow-300 border-b-2 border-zinc-100 shadow shadow-blue-900/30"
                  : "hover:bg-zinc-800 text-zinc-400 border-b-2 border-transparent"
              }`}
              onClick={() => setActiveLeftTab(tab)}
            >
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-8 md:py-5 scroll-smooth">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <h1 className="text-2xl font-extrabold text-white">{problem.title}</h1>
                    <span className={`badge badge-outline ${getDifficultyColor(problem.difficulty)} capitalize font-medium text-xs`}>
                      {problem.difficulty}
                    </span>
                    {Array.isArray(problem.tags)
                      ? problem.tags.map((tag, idx) => (
                          <span key={idx} className="badge badge-primary bg-blue-900 text-blue-200 border-none text-xs">{tag}</span>
                        ))
                      : <span className="badge badge-primary">{problem.tags}</span>}
                  </div>
                  <div className="whitespace-pre-wrap text-base text-zinc-200 leading-relaxed">{problem.description}</div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-300">Examples</h3>
                    {Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length > 0 ? (
                      problem.visibleTestCases.map((ex, i) => (
                        <div key={i} className="border border-zinc-700/70 p-4 rounded-xl mb-4 shadow shadow-blue-900/10">
                          <h4 className="font-semibold mb-2 text-yellow-400">Example {i + 1}:</h4>
                          <div className="text-sm font-mono tracking-tight space-y-1">
                            <div><strong className="text-zinc-300">Input:</strong> {ex.input}</div>
                            <div><strong className="text-zinc-300">Output:</strong> {ex.output}</div>
                            <div><strong className="text-zinc-300">Explanation:</strong> {ex.explanation}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-600 italic">No examples available.</p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="whitespace-pre-wrap text-base text-zinc-300 leading-relaxed border-l-2 border-blue-900 pl-3">
                  Editorial is here for the problem.
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Reference Solutions</h2>
                  {Array.isArray(problem.referenceSolution) && problem.referenceSolution.length > 0 ? (
                    problem.referenceSolution.map((sol, i) => (
                      <details key={i} className="mb-3 rounded-b-xl border border-yellow-700 ring-1 ring-zinc-900/10 shadow">
                        <summary className="cursor-pointer py-2 px-4 font-mono">{problem.title} - <span className="font-bold">{sol.language}</span></summary>
                        <div className="px-4 pb-4">
                          <pre className="bg-zinc-950 text-zinc-300 p-3 rounded-lg text-sm overflow-x-auto">
                            <code>{sol.completeCode}</code>
                          </pre>
                        </div>
                      </details>
                    ))
                  ) : (
                    <div className="text-zinc-500">Solutions will be available after you solve the problem.</div>
                  )}
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div>
                  <h2 className="text-xl text-blue-300 font-bold mb-4">My Submissions</h2>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div className="flex-1 h-[600px] max-h-[90vh] min-h-0 flex flex-col">
                  <ChatAi />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex flex-col min-h-0 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden">
        <nav className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 h-14">
          <div className="flex gap-4 px-3">
            {["code", "testcase", "result"].map((tab) => (
              <button
                key={tab}
                className={
                  "relative px-2 md:px-5 h-9 rounded-t-lg font-semibold capitalize transition-all ease-in-out duration-150 " +
                  (activeRightTab === tab
                    ? "text-amber-300 border-b-2 border-amber-400 bg-zinc-950 shadow-inner"
                    : "text-zinc-400 hover:text-amber-200 border-b-2 border-transparent")
                }
                onClick={() => setActiveRightTab(tab)}
              >
                {tab}
                {activeRightTab === tab && (
                  <span className="absolute left-1/2 bottom-0 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </nav>
        <div className="flex-1 flex flex-col min-h-0">
          {activeRightTab === "code" && (
            <>
              <div className="flex items-center justify-between px-5 py-2 bg-gradient-to-r from-zinc-950/90 to-yellow-950/20 border-b border-zinc-800">
                <div className="flex gap-2">
                  {Object.keys(langMap).map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-xs sm:btn-sm btn-outline capitalize rounded-full px-3.5 border-2 border-transparent transition-all ${
                        selectedLanguage === lang
                          ? "bg-green-800 border-blue-400 text-blue-200 font-semibold"
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {langMap[lang]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative flex-1 min-h-0">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 15,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    folding: true,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    readOnly: false,
                    cursorStyle: "line",
                    mouseWheelZoom: true,
                    fontFamily: "'JetBrains Mono', 'Fira Mono', monospace",
                    smoothScrolling: true,
                    formatOnType: true,
                  }}
                />
                {loading && (
                  <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center z-10">
                    <span className="loading loading-bars text-blue-400 scale-125"></span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-5 py-3 border-t border-zinc-800 bg-zinc-950/80">
                <button
                  className="btn btn-ghost btn-xs sm:btn-sm px-3 font-medium text-zinc-400 hover:text-blue-200"
                  onClick={() => setActiveRightTab("testcase")}
                >
                  View Console
                </button>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-xs sm:btn-sm border-blue-800 text-blue-400 hover:bg-blue-800/60 transition ${
                      loading ? "btn-disabled opacity-50" : ""
                    }`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner loading-xs"></span> : "Run"}
                  </button>
                  <button
                    className={`btn btn-primary btn-xs sm:btn-sm transition ${
                      loading ? "btn-disabled opacity-60" : ""
                    }`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-dots loading-xs"></span> : "Submit"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeRightTab === "testcase" && (
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 bg-zinc-900">
              <h3 className="sticky top-0 z-10 bg-zinc-900 text-blue-200 text-base font-semibold mb-2">Test Results</h3>
              {Array.isArray(runResult) && runResult.length > 0 ? (
                runResult.map((result, i) => (
                  <div
                    key={i}
                    className={`rounded-lg px-5 py-3 mb-4 shadow ${
                      result.status?.description === "Accepted"
                        ? "border border-green-800 bg-green-900/20 text-green-200 shadow-green-800/5"
                        : "border border-pink-700 bg-pink-900/10 text-pink-200 shadow-pink-800/10"
                    }`}
                  >
                    <strong className="block text-base font-semibold">
                      {result.status?.description === "Accepted" ? "✅" : "❌"}
                      Test Case {i + 1} - {result.status?.description}
                    </strong>
                    <div className="font-mono text-sm mt-1 space-y-0.5">
                      <div><span className="font-bold">Input:</span> {result.stdin}</div>
                      <div><span className="font-bold">Expected:</span> {result.expected_output}</div>
                      <div><span className="font-bold">Output:</span> {result.stdout}</div>
                      <div><span className="font-bold">Runtime:</span> {result.time} sec</div>
                      <div><span className="font-bold">Memory:</span> {result.memory} KB</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm italic">No result yet. Click <span className="font-bold text-zinc-300">Run</span> to see output.</p>
              )}
            </div>
          )}

          {activeRightTab === "result" && (
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 bg-zinc-900">
              <h3 className="sticky top-0 z-10 bg-zinc-900 text-amber-200 text-base font-semibold mb-2">Submission Result</h3>
              {submitResult ? (
                <div
                  className={
                    "rounded-lg px-5 py-4 shadow " +
                    (submitResult.accepted
                      ? "border border-green-700 bg-green-900/25 text-green-200"
                      : "border border-pink-700 bg-pink-900/20 text-pink-200")
                  }
                >
                  <h4 className="font-bold text-lg">
                    {submitResult.accepted ? "🎉 Accepted" : "❌ " + submitResult.error}
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-4">
                    <p>Test Cases Passed: <span className="font-semibold">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></p>
                    <p>Runtime: <span className="font-semibold">{submitResult.runtime} sec</span></p>
                    <p>Memory: <span className="font-semibold">{submitResult.memory} KB</span></p>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm italic">No result yet. Click <span className="text-amber-300">Submit</span> to see output.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
