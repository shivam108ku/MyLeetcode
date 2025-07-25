// MultiLanguageCodeVisualizer.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Code,
  Bug,
  Eye,
  Copy,
  Zap,
  Settings,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AlgoVisualiser = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [variables, setVariables] = useState({});
  const [currentLine, setCurrentLine] = useState(null);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [speed, setSpeed] = useState(500);
  const [callStack, setCallStack] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef(null);

  // Default code for each language
  const getDefaultCode = (lang) => {
    const defaults = {
      javascript: `function addTwoNumbers(a, b) {
  let result = 0;
  console.log("Starting addition...");
  
  for (let i = 0; i < 3; i++) {
    result += i;
    console.log("Loop iteration:", i, "Result so far:", result);
  }
  
  result = a + b;
  console.log("Final result:", result);
  return result;
}

// Test the function
addTwoNumbers(10, 20);`,
      cpp: `#include <iostream>
using namespace std;

int addTwoNumbers(int a, int b) {
    int result = 0;
    cout << "Starting addition..." << endl;
    
    for (int i = 0; i < 3; i++) {
        result += i;
        cout << "Loop iteration: " << i << " Result so far: " << result << endl;
    }
    
    result = a + b;
    cout << "Final result: " << result << endl;
    return result;
}

int main() {
    addTwoNumbers(10, 20);
    return 0;
}`,
    };
    return defaults[lang] || defaults.javascript;
  };

  // Initialize code when language changes
  useEffect(() => {
    if (
      !code ||
      code === getDefaultCode(language === "javascript" ? "cpp" : "javascript")
    ) {
      setCode(getDefaultCode(language));
    }
    reset();
  }, [language]);

  // Handle better code input
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === "Tab") {
      e.preventDefault();
      const beforeTab = value.substring(0, selectionStart);
      const afterTab = value.substring(selectionEnd);
      const newValue = beforeTab + "    " + afterTab;
      setCode(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
      }, 0);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lines = value.substring(0, selectionStart).split("\n");
      const currentLineText = lines[lines.length - 1];
      const indentMatch = currentLineText.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : "";

      const extraIndent = currentLineText.trim().endsWith("{") ? "    " : "";
      const newIndent = currentIndent + extraIndent;

      const beforeEnter = value.substring(0, selectionStart);
      const afterEnter = value.substring(selectionEnd);
      const newValue = beforeEnter + "\n" + newIndent + afterEnter;
      setCode(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + 1 + newIndent.length;
      }, 0);
    }
  };

  // Validate JavaScript syntax before execution
  const validateJavaScriptSyntax = (code) => {
    try {
      // Create a function to test syntax without executing
      new Function(code);
      return { valid: true, error: null };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  };

  // Clean and prepare JavaScript code
  const cleanJavaScriptCode = (code) => {
    // Remove common syntax issues
    let cleanedCode = code
      // Remove extra semicolons
      .replace(/;;+/g, ";")
      // Fix common spacing issues
      .replace(/\s*;\s*}/g, ";}")
      // Remove trailing semicolons before closing braces
      .replace(/;\s*(?=})/g, "")
      // Ensure proper line endings
      .replace(/([^;{}\s])\s*\n/g, "$1;\n");

    return cleanedCode;
  };

  // Execute code based on language
  const executeCode = async () => {
    try {
      setError(null);
      setOutput([]);
      setVariables({});
      setCallStack([]);

      if (language === "javascript") {
        // Validate and clean JavaScript code first
        const cleanedCode = cleanJavaScriptCode(code);
        const validation = validateJavaScriptSyntax(cleanedCode);

        if (!validation.valid) {
          throw new Error(`Syntax Error: ${validation.error}`);
        }

        executeJavaScript(cleanedCode);
      } else if (language === "cpp") {
        await executeCpp();
      }
    } catch (err) {
      setError(`Execution Error: ${err.message}`);
      console.error("Code execution error:", err);
    }
  };

  // Execute JavaScript code with better error handling
  const executeJavaScript = (cleanedCode) => {
    try {
      const instrumentedCode = instrumentJavaScriptCode(cleanedCode);
      const steps = [];
      const vars = {};
      const logs = [];
      const stack = [];

      const context = {
        addStep: (lineNum, type, data) => {
          try {
            steps.push({
              step: steps.length,
              line: lineNum,
              type: type,
              data: data,
              variables: { ...vars },
              callStack: [...stack],
              output: [...logs],
            });
          } catch (err) {
            console.warn("Error adding step:", err);
          }
        },
        setVariable: (name, value) => {
          try {
            // Safely handle variable assignment
            if (typeof name === "string" && name.length > 0) {
              vars[name] = value;
            }
          } catch (err) {
            console.warn("Error setting variable:", err);
          }
        },
        log: (...args) => {
          try {
            logs.push(
              args
                .map((arg) =>
                  typeof arg === "object" ? JSON.stringify(arg) : String(arg)
                )
                .join(" ")
            );
          } catch (err) {
            logs.push("Error logging value");
          }
        },
        pushCall: (funcName, params) => {
          try {
            stack.push({
              function: String(funcName),
              parameters: String(params),
            });
          } catch (err) {
            console.warn("Error pushing call:", err);
          }
        },
        popCall: () => {
          try {
            stack.pop();
          } catch (err) {
            console.warn("Error popping call:", err);
          }
        },
      };

      // Execute instrumented code in try-catch
      eval(instrumentedCode);

      setExecutionSteps(steps);
      setExecutionStep(0);
    } catch (err) {
      throw new Error(`JavaScript Execution Error: ${err.message}`);
    }
  };

  // Execute C++ code (simulated)
  const executeCpp = async () => {
    try {
      const steps = simulateCppExecution(code);
      setExecutionSteps(steps);
      setExecutionStep(0);
    } catch (err) {
      throw new Error(`C++ Execution Error: ${err.message}`);
    }
  };

  // Simulate C++ execution with better parsing
  const simulateCppExecution = (cppCode) => {
    const steps = [];
    const lines = cppCode.split("\n");
    let vars = {};
    let logs = [];
    let stack = [];

    try {
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();

        // Skip empty lines and preprocessor directives
        if (
          trimmedLine === "" ||
          trimmedLine.startsWith("//") ||
          trimmedLine.startsWith("#") ||
          trimmedLine.startsWith("using") ||
          trimmedLine === "{" ||
          trimmedLine === "}"
        ) {
          return;
        }

        steps.push({
          step: steps.length,
          line: lineNum,
          type: "execution",
          data: trimmedLine,
          variables: { ...vars },
          callStack: [...stack],
          output: [...logs],
        });

        // Parse variable declarations
        const intVarMatch = trimmedLine.match(/int\s+(\w+)\s*=\s*([^;]+);?/);
        if (intVarMatch) {
          const varName = intVarMatch[1];
          const varValue = intVarMatch[2];

          // Simple evaluation for basic expressions
          try {
            const numValue = eval(
              varValue.replace(/[a-zA-Z_]\w*/g, (match) => vars[match] || match)
            );
            vars[varName] = numValue;
          } catch {
            vars[varName] = varValue;
          }
        }

        // Parse cout statements
        const coutMatch = trimmedLine.match(/cout\s*<<\s*"([^"]*)".*?;?/);
        if (coutMatch) {
          logs.push(coutMatch[1]);
        }

        // Parse cout with variables
        const coutVarMatch = trimmedLine.match(
          /cout\s*<<\s*"([^"]*)".*?<<\s*(\w+).*?;?/
        );
        if (coutVarMatch) {
          const text = coutVarMatch[1];
          const varName = coutVarMatch[2];
          logs.push(`${text} ${vars[varName] || varName}`);
        }

        // Parse function declarations
        if (
          trimmedLine.includes("(") &&
          !trimmedLine.includes("cout") &&
          !trimmedLine.includes("for") &&
          !trimmedLine.includes("if")
        ) {
          const funcMatch = trimmedLine.match(/(\w+)\s*\(/);
          if (funcMatch && funcMatch[1] !== "main") {
            stack.push({ function: funcMatch[1], parameters: "params" });
          }
        }

        // Simulate for loop
        const forMatch = trimmedLine.match(
          /for\s*\(\s*int\s+(\w+)\s*=\s*(\d+);\s*\w+\s*<\s*(\d+)/
        );
        if (forMatch) {
          const loopVar = forMatch[1];
          const start = parseInt(forMatch[2]);
          const end = parseInt(forMatch[3]);

          for (let i = start; i < end; i++) {
            vars[loopVar] = i;
            steps.push({
              step: steps.length,
              line: lineNum,
              type: "loop_iteration",
              data: `Loop: ${loopVar} = ${i}`,
              variables: { ...vars },
              callStack: [...stack],
              output: [...logs],
            });
          }
        }
      });
    } catch (err) {
      throw new Error(`C++ Parsing Error: ${err.message}`);
    }

    return steps;
  };

  // Improved JavaScript code instrumentation
  const instrumentJavaScriptCode = (originalCode) => {
    try {
      let lines = originalCode.split("\n");
      let instrumentedLines = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        // Skip empty lines and comments
        if (trimmedLine === "" || trimmedLine.startsWith("//")) {
          instrumentedLines.push(line);
          return;
        }

        // Add step tracking
        instrumentedLines.push(
          `try { context.addStep(${lineNumber}, 'execution', ${JSON.stringify(
            trimmedLine
          )}); } catch(e) {}`
        );

        // Handle variable declarations
        if (trimmedLine.match(/^(let|const|var)\s+\w+/)) {
          const modifiedLine = line.replace(
            /(let|const|var)\s+(\w+)\s*=\s*([^;]+);?/,
            (match, keyword, varName, value) => {
              return `${keyword} ${varName} = ${value}; try { context.setVariable(${JSON.stringify(
                varName
              )}, ${varName}); } catch(e) {}`;
            }
          );
          instrumentedLines.push(modifiedLine);
        }
        // Handle function declarations
        else if (trimmedLine.includes("function ")) {
          const funcMatch = trimmedLine.match(/function\s+(\w+)\s*\(([^)]*)\)/);
          if (funcMatch) {
            const funcName = funcMatch[1];
            const params = funcMatch[2];
            instrumentedLines.push(line);
            instrumentedLines.push(
              `try { context.pushCall(${JSON.stringify(
                funcName
              )}, ${JSON.stringify(params)}); } catch(e) {}`
            );
          } else {
            instrumentedLines.push(line);
          }
        }
        // Handle console.log
        else if (trimmedLine.includes("console.log")) {
          const logLine = line.replace("console.log", "context.log");
          instrumentedLines.push(logLine);
        }
        // Handle variable assignments
        else if (trimmedLine.match(/^\w+\s*=/) && !trimmedLine.includes("==")) {
          instrumentedLines.push(line);
          const varMatch = trimmedLine.match(/^(\w+)\s*=/);
          if (varMatch) {
            const varName = varMatch[1];
            instrumentedLines.push(
              `try { context.setVariable(${JSON.stringify(
                varName
              )}, ${varName}); } catch(e) {}`
            );
          }
        }
        // Handle return statements
        else if (trimmedLine.includes("return")) {
          instrumentedLines.push(
            `try { context.addStep(${lineNumber}, 'return', ${JSON.stringify(
              trimmedLine
            )}); } catch(e) {}`
          );
          instrumentedLines.push(line);
          instrumentedLines.push(`try { context.popCall(); } catch(e) {}`);
        } else {
          instrumentedLines.push(line);
        }
      });

      return instrumentedLines.join("\n");
    } catch (err) {
      throw new Error(`Code instrumentation failed: ${err.message}`);
    }
  };

  const stepForward = () => {
    if (executionStep < executionSteps.length - 1) {
      const nextStep = executionStep + 1;
      setExecutionStep(nextStep);
      updateVisualization(executionSteps[nextStep]);
    }
  };

  const stepBackward = () => {
    if (executionStep > 0) {
      const prevStep = executionStep - 1;
      setExecutionStep(prevStep);
      updateVisualization(executionSteps[prevStep]);
    }
  };

  const updateVisualization = (step) => {
    if (step) {
      setCurrentLine(step.line);
      setVariables(step.variables || {});
      setOutput(step.output || []);
      setCallStack(step.callStack || []);
    }
  };

  useEffect(() => {
    if (isExecuting && executionStep < executionSteps.length - 1) {
      const timer = setTimeout(() => {
        stepForward();
      }, speed);
      return () => clearTimeout(timer);
    } else if (executionStep >= executionSteps.length - 1) {
      setIsExecuting(false);
    }
  }, [isExecuting, executionStep, speed, executionSteps.length]);

  const reset = () => {
    setIsExecuting(false);
    setExecutionStep(0);
    setCurrentLine(null);
    setVariables({});
    setOutput([]);
    setCallStack([]);
    setError(null);
    setExecutionSteps([]);
  };

  const toggleExecution = () => {
    if (executionSteps.length === 0) {
      executeCode();
    }
    setIsExecuting(!isExecuting);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const loadExample = (exampleCode) => {
    setCode(exampleCode);
    reset();
  };

  return (
    <div className="min-h-screen">
      {/* How to Use Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-2xl p-8 max-w-4xl max-h-[80vh] overflow-y-auto border border-zinc-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  How to Use DSA Code Visualizer
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-zinc-300">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    🔧 Syntax Tips
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <p className="mb-2">
                      <strong>JavaScript:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>End statements with semicolons</li>
                      <li>
                        Use proper variable declarations:{" "}
                        <code className="bg-zinc-700 px-1 rounded">
                          let x = 5;
                        </code>
                      </li>
                      <li>
                        Functions:{" "}
                        <code className="bg-zinc-700 px-1 rounded">
                          function name() {}
                        </code>
                      </li>
                      <li>
                        Loops:{" "}
                        <code className="bg-zinc-700 px-1 rounded">
                          for (let i = 0; i &lt; 5; i++) {}
                        </code>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    📋 Step-by-Step Guide
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Select your programming language (JavaScript or C++)
                    </li>
                    <li>Write or load sample code</li>
                    <li>Click "Parse & Setup" to analyze your code</li>
                    <li>Use execution controls to step through code</li>
                    <li>Watch variables, call stack, and output panels</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    🐛 Common Issues
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>"Unexpected token ';'":</strong> Check for extra
                      semicolons or missing braces
                    </li>
                    <li>
                      <strong>Variable not showing:</strong> Make sure to
                      declare with let/const/var
                    </li>
                    <li>
                      <strong>Function not tracking:</strong> Use proper
                      function declaration syntax
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-clip-text text-transparent mb-3">
              Multi-Language DSA Code Visualizer
            </h1>
            <p className="text-zinc-300 text-lg mb-4">
              Write DSA code in JavaScript or C++ and see live execution flow
            </p>
            <button
              onClick={() => setShowGuide(true)}
              className="px-4 py-2 border border-green-600 rounded-b-2xl flex items-center gap-2 mx-auto transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              How to Use & Fix Syntax Errors
            </button>
          </motion.div>

          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
              <button
                onClick={() => setLanguage("javascript")}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  language === "javascript"
                    ? "bg-zinc-600 text-white shadow-lg"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => setLanguage("cpp")}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  language === "cpp"
                    ? "bg-green-900 text-white shadow-lg"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                C++
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-700">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-white">
                    {language === "javascript" ? "JavaScript" : "C++"} Editor
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={executeCode}
                    className="px-4 py-2 bg-gradient-to-r from-zinc-600 to-green-600 hover:from-green-700 hover:to-zinc-700 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    Parse & Setup
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="flex">
                  {/* Line numbers */}
                  <div className="bg-zinc-800 text-zinc-500 text-sm font-mono px-4 py-4 select-none border-r border-zinc-700">
                    {code.split("\n").map((_, index) => (
                      <div
                        key={index}
                        className={`h-6 leading-6 text-right ${
                          currentLine === index + 1
                            ? "text-yellow-400 font-bold"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code textarea */}
                  <div className="flex-1  relative">
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className={`w-full h-screen p-4 bg-black font-mono text-sm resize-none focus:outline-none leading-6 ${
                        language === "javascript"
                          ? "text-green-200"
                          : "text-blue-400"
                      }`}
                      placeholder={`Write your ${
                        language === "javascript" ? "JavaScript" : "C++"
                      } DSA code here...`}
                      spellCheck={false}
                    />

                    {/* Current line highlighting */}
                    {currentLine && (
                      <div
                        className="absolute left-0 bg-yellow-500 bg-opacity-10 border-l-4 border-yellow-400
                         pointer-events-none"
                        style={{
                          top: `${(currentLine - 1) * 24 + 16}px`,
                          height: "24px",
                          width: "100%",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visualization Panel */}
            <div className="space-y-4">
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-xl text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Execution Controls
                  </h3>
                  <button
                    onClick={reset}
                    className="p-2 bg-yellow-600 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={stepBackward}
                    disabled={executionStep === 0}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    ← Step Back
                  </button>

                  <button
                    onClick={toggleExecution}
                    className={`p-3 rounded-lg transition-all ${
                      isExecuting
                        ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25"
                        : "bg-green-800 hover:bg-green-600 shadow-lg shadow-green-600/25"
                    }`}
                  >
                    {isExecuting ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={stepForward}
                    disabled={executionStep >= executionSteps.length - 1}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Step Forward →
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-zinc-300 min-w-0">
                      Speed:
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="flex-1 accent-purple-500"
                    />
                    <span className="text-sm text-zinc-400 min-w-0">
                      {speed}ms
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400 bg-zinc-800 px-3 py-2 rounded-lg">
                    Step{" "}
                    <span className="text-white font-semibold">
                      {executionStep + 1}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-semibold">
                      {executionSteps.length}
                    </span>
                    {currentLine && (
                      <span>
                        {" "}
                        • Line{" "}
                        <span className="text-yellow-400 font-semibold">
                          {currentLine}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Variables Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl"
              >
                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2 text-white">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Variables & State
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {Object.entries(variables).map(([name, value]) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex justify-between items-center bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-700"
                      >
                        <span className="text-blue-400 font-mono font-semibold">
                          {name}
                        </span>
                        <span className="text-green-400 font-mono">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {Object.keys(variables).length === 0 && (
                    <div className="text-zinc-500 text-sm text-center py-4">
                      No variables yet
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Call Stack */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl"
              >
                <h3 className="font-semibold text-xl mb-4 text-white">
                  Call Stack
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {callStack.map((call, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800 px-4 py-2 rounded-xl text-sm border border-zinc-700"
                    >
                      <span className="text-purple-400 font-semibold">
                        {call.function}
                      </span>
                      <span className="text-zinc-400">({call.parameters})</span>
                    </div>
                  ))}
                  {callStack.length === 0 && (
                    <div className="text-zinc-500 text-sm text-center py-2">
                      No function calls
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Output/Console */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl"
              >
                <h3 className="font-semibold text-xl mb-4 text-white">
                  Console Output
                </h3>
                <div className="bg-black rounded-xl p-4 h-40 overflow-y-auto font-mono text-sm border border-zinc-800">
                  {output.map((log, index) => (
                    <div key={index} className="text-green-400 mb-1">
                      <span className="text-zinc-500">{">"}</span>{" "}
                      {typeof log === "object"
                        ? JSON.stringify(log)
                        : String(log)}
                    </div>
                  ))}
                  {output.length === 0 && (
                    <div className="text-zinc-600 text-center py-8">
                      No output yet
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-900/20 border border-red-700 rounded-2xl p-6"
                  >
                    <h3 className="font-semibold text-xl mb-3 flex items-center gap-2 text-white">
                      <Bug className="w-5 h-5 text-red-400" />
                      Error
                    </h3>
                    <pre className="text-red-300 text-sm whitespace-pre-wrap bg-red-900/10 p-3 rounded-lg">
                      {error}
                    </pre>
                    <div className="mt-3 text-sm text-red-200">
                      <strong>Common fixes:</strong>
                      <ul className="list-disc list-inside mt-1">
                        <li>
                          Check for missing semicolons or extra semicolons
                        </li>
                        <li>
                          Ensure proper variable declarations (let, const, var)
                        </li>
                        <li>Verify function syntax and closing braces</li>
                        <li>Use the sample code examples below</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sample Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl"
          >
            <h3 className="font-semibold text-2xl mb-6 text-white flex items-center gap-2">
              📚 Sample DSA Problems -{" "}
              {language === "javascript" ? "JavaScript" : "C++"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(language === "javascript"
                ? [
                    {
                      title: "Two Sum",
                      description: "Find two numbers that add up to target",
                      code: `function twoSum(nums, target) {
  let map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    console.log("Looking for:", complement);
    
    if (map.has(complement)) {
      console.log("Found pair:", nums[i], complement);
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
    console.log("Added to map:", nums[i], "at index", i);
  }
  
  return [];
}

let nums = [2, 7, 11, 15];
let target = 9;
twoSum(nums, target);`,
                    },
                    {
                      title: "Binary Search",
                      description: "Search efficiently in sorted array",
                      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    console.log("Checking middle:", mid, "value:", arr[mid]);
    
    if (arr[mid] === target) {
      console.log("Found target at index:", mid);
      return mid;
    } else if (arr[mid] < target) {
      console.log("Target is on right side");
      left = mid + 1;
    } else {
      console.log("Target is on left side");
      right = mid - 1;
    }
  }
  
  return -1;
}

let arr = [1, 3, 5, 7, 9];
let target = 5;
binarySearch(arr, target);`,
                    },
                    {
                      title: "Fibonacci",
                      description: "Generate fibonacci sequence iteratively",
                      code: `function fibonacci(n) {
  if (n <= 1) {
    console.log("Base case:", n);
    return n;
  }
  
  let a = 0;
  let b = 1;
  console.log("Starting with a =", a, "b =", b);
  
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    console.log("Step", i, ":", a, "+", b, "=", temp);
    a = b;
    b = temp;
  }
  
  return b;
}

let n = 6;
fibonacci(n);`,
                    },
                  ]
                : [
                    {
                      title: "Two Sum",
                      description: "Find two numbers that add up to target",
                      code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int> nums, int target) {
    unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        cout << "Looking for: " << complement << endl;
        
        if (map.find(complement) != map.end()) {
            cout << "Found pair: " << nums[i] << " " << complement << endl;
            return {map[complement], i};
        }
        
        map[nums[i]] = i;
        cout << "Added to map: " << nums[i] << " at index " << i << endl;
    }
    
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    twoSum(nums, 9);
    return 0;
}`,
                    },
                    {
                      title: "Binary Search",
                      description: "Search efficiently in sorted array",
                      code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int> arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        cout << "Checking middle: " << mid << " value: " << arr[mid] << endl;
        
        if (arr[mid] == target) {
            cout << "Found target at index: " << mid << endl;
            return mid;
        } else if (arr[mid] < target) {
            cout << "Target is on right side" << endl;
            left = mid + 1;
        } else {
            cout << "Target is on left side" << endl;
            right = mid - 1;
        }
    }
    
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9};
    binarySearch(arr, 5);
    return 0;
}`,
                    },
                    {
                      title: "Fibonacci",
                      description: "Generate fibonacci sequence iteratively",
                      code: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) {
        cout << "Base case: " << n << endl;
        return n;
    }
    
    int a = 0, b = 1;
    cout << "Starting with a = " << a << " b = " << b << endl;
    
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        cout << "Step " << i << ": " << a << " + " << b << " = " << temp << endl;
        a = b;
        b = temp;
    }
    
    return b;
}

int main() {
    fibonacci(6);
    return 0;
}`,
                    },
                  ]
              ).map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadExample(example.code)}
                  className="text-left p-6 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all border border-zinc-700 hover:border-zinc-600"
                >
                  <h4
                    className={`font-semibold text-lg mb-2 ${
                      language === "javascript"
                        ? "text-yellow-400"
                        : "text-orange-400"
                    }`}
                  >
                    {example.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    {example.description}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Click to load this example
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AlgoVisualiser;
