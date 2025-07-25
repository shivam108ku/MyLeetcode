import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../Utils/axiosClient";
import { Send, Bot, User, AlertCircle, Loader2, Code2 } from 'lucide-react';

function ChatAi({ problem, submittedCode, language }) {
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            content: `Hi! I'm your AI tutor. I can help you with "${problem?.title || 'this problem'}". Feel free to ask for hints, explanations, or code reviews!`,
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const messageValue = watch("message", "");

    // Auto scroll to bottom when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, isLoading]);

    const onSubmit = async (data) => {
        if (!data.message?.trim()) return;
        
        const userMessage = {
            role: 'user',
            content: data.message.trim(),
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem?.title,
                description: problem?.description,
                testCases: problem?.visibleTestCases,
                startCode: problem?.startCode
            });

            const aiMessage = {
                role: 'model',
                content: response.data.message || response.data.content || "I'm sorry, I couldn't generate a response.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("API Error:", error);
            const errorMessage = {
                role: 'model',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Handle review code with submitted code
    const handleReviewCode = () => {
        if (!submittedCode) {
            const noCodeMessage = "Please provide your code for review. You can paste it in the chat.";
            setValue("message", noCodeMessage);
            return;
        }

        const reviewMessage = `Can you review my ${language || 'code'} solution? Here's my code:

\`\`\`${language?.toLowerCase() || 'javascript'}
${submittedCode}
\`\`\`

Please check for:
1. Correctness of the algorithm
2. Time and space complexity
3. Code quality and best practices
4. Potential bugs or edge cases
5. Suggestions for improvement`;

        setValue("message", reviewMessage);
    };

    // Handle code explanation with submitted code
    const handleExplainCode = () => {
        if (!submittedCode) {
            setValue("message", "Please provide your code and I'll explain how it works.");
            return;
        }

        const explainMessage = `Can you explain how this ${language || 'code'} solution works step by step?

\`\`\`${language?.toLowerCase() || 'javascript'}
${submittedCode}
\`\`\`

Please explain:
1. The overall approach
2. How each part of the code works
3. Time and space complexity
4. Why this solution is correct`;

        setValue("message", explainMessage);
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user';
        const isError = msg.isError;

        return (
            <div 
                key={index} 
                className={`flex gap-3 animate-fadeIn ${isUser ? 'flex-row-reverse' : 'flex-row'} w-full`}
            >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser 
                        ? 'bg-blue-600 text-white' 
                        : isError 
                            ? 'bg-red-900/30 text-red-400 border border-red-800/50' 
                            : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                }`}>
                    {isUser ? <User size={16} /> : isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Content - Fixed width constraints */}
                <div className={`flex flex-col min-w-0 max-w-[calc(100%-3rem)] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2 shadow-sm break-words ${
                        isUser 
                            ? 'bg-blue-600 text-white rounded-br-md' 
                            : isError
                                ? 'bg-red-950/50 text-red-300 border border-red-800/30 rounded-bl-md'
                                : 'bg-zinc-800/70 text-zinc-200 border border-zinc-700/50 rounded-bl-md backdrop-blur-sm'
                    }`}>
                        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans break-words overflow-hidden">
                            {msg.content}
                        </pre>
                    </div>
                    <span className="text-xs text-zinc-500 mt-1 px-2 flex-shrink-0">
                        {formatTime(msg.timestamp)}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[95%] overflow-y-hidden bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 overflow-hidden max-w-full">
            {/* Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-zinc-100 truncate">AI Tutor</h3>
                            <p className="text-xs text-zinc-400">
                                {isLoading ? (
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        Thinking...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        Online
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    {/* Submitted Code Indicator */}
                    {submittedCode && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 flex-shrink-0">
                            <Code2 size={14} />
                            <span className="hidden sm:inline">{language || 'Code'} Ready</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Container - Fixed width and scroll */}
           <div 
    ref={messagesContainerRef}
    className="flex-1 p-4 space-y-4 h-[50%]
    bg-gradient-to-b from-zinc-00 via-zinc-900/95 to-zinc-900
    max-w-full overflow-y-scroll"
>

                {messages.map((msg, index) => renderMessage(msg, index))}
                
                {/* Loading Message */}
                {isLoading && (
                    <div className="flex gap-3 animate-fadeIn w-full">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-zinc-800/70 border border-zinc-700/50 shadow-sm backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-emerald-400" />
                                    <span className="text-sm text-zinc-300">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
                
            </div>

            {/* Input Form - Fixed height */}
            <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex-shrink-0">
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                    <div className="flex-1 relative min-w-0">
                        <textarea
                            {...register("message", { 
                                required: "Message is required",
                                minLength: { value: 1, message: "Message too short" },
                                maxLength: { value: 2000, message: "Message too long" }
                            })}
                            placeholder="Ask for hints, explanations, or code help..."
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder-zinc-400 resize-none ${
                                errors.message 
                                    ? 'border-red-600 bg-red-950/20' 
                                    : 'border-zinc-700 hover:border-zinc-600'
                            }`}
                            disabled={isLoading}
                            rows={1}
                            style={{ 
                                minHeight: '48px', 
                                maxHeight: '120px',
                                height: 'auto'
                            }}
                            onInput={(e) => {
                                // Auto-resize textarea
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                        />
                        
                        {/* Character count */}
                        <div className="absolute right-12 bottom-3">
                            <span className={`text-xs ${
                                messageValue.length > 1800 ? 'text-red-400' : 'text-zinc-500'
                            }`}>
                                {messageValue.length}/2000
                            </span>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !!errors.message || !messageValue.trim()}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group shadow-lg"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} className="group-hover:translate-x-0.5 transition-transform" />
                        )}
                    </button>
                </form>
                
                {/* Error Message */}
                {errors.message && (
                    <p className="text-xs text-red-400 mt-2 px-4">
                        {errors.message.message}
                    </p>
                )}
                
                {/* Enhanced Quick Actions */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setValue("message", "Can you give me a hint for this problem?")}
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 flex-shrink-0"
                        disabled={isLoading}
                    >
                        💡 Get Hint
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue("message", "Can you explain the optimal approach?")}
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 flex-shrink-0"
                        disabled={isLoading}
                    >
                        🧠 Explain Approach
                    </button>
                    <button
                        type="button"
                        onClick={handleReviewCode}
                        className={`px-3 py-1 text-xs border rounded-full transition-all duration-200 flex-shrink-0 ${
                            submittedCode 
                                ? 'bg-emerald-800/30 text-emerald-300 border-emerald-700/50 hover:bg-emerald-700/30 hover:border-emerald-600/50'
                                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600'
                        }`}
                        disabled={isLoading}
                        title={submittedCode ? `Review your ${language} code` : 'No code submitted yet'}
                    >
                        🔍 <span className="hidden sm:inline">{submittedCode ? `Review ${language}` : 'Review Code'}</span>
                        <span className="sm:hidden">Review</span>
                    </button>
                    {submittedCode && (
                        <button
                            type="button"
                            onClick={handleExplainCode}
                            className="px-3 py-1 text-xs bg-blue-800/30 text-blue-300 border border-blue-700/50 rounded-full hover:bg-blue-700/30 hover:border-blue-600/50 transition-all duration-200 flex-shrink-0"
                            disabled={isLoading}
                        >
                            📖 <span className="hidden sm:inline">Explain My Code</span>
                            <span className="sm:hidden">Explain</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatAi;
