const axios = require('axios');

const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;
        
        // Validate required fields
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required and cannot be empty"
            });
        }

        // Prepare the system instruction
        const systemInstruction = `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title || 'Not provided'}
[PROBLEM_DESCRIPTION]: ${description || 'Not provided'}
[EXAMPLES]: ${JSON.stringify(testCases) || 'Not provided'}
[START_CODE]: ${JSON.stringify(startCode) || 'Not provided'}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:

### When user asks for HINTS:
- Break down the problem into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Suggest relevant data structures or techniques to consider

### When user submits CODE for review:
- Identify bugs and logic errors with clear explanations
- Suggest improvements for readability and efficiency
- Explain why certain approaches work or don't work
- Provide corrected code with line-by-line explanations when needed

### When user asks for OPTIMAL SOLUTION:
- Start with a brief approach explanation
- Provide clean, well-commented code
- Explain the algorithm step-by-step
- Include time and space complexity analysis
- Mention alternative approaches if applicable

### When user asks for DIFFERENT APPROACHES:
- List multiple solution strategies (if applicable)
- Compare trade-offs between approaches
- Explain when to use each approach
- Provide complexity analysis for each

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always respond in the language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems
- If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.
`;

        // Prepare messages for the API (OpenAI format)
        const apiMessages = [
            {
                role: 'system',
                content: systemInstruction
            },
            ...messages.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.content || msg.message || msg.text || ''
            }))
        ];

        // Log the request for debugging
        console.log('Sending messages to API:', JSON.stringify(apiMessages, null, 2));

        // RapidAPI Gemini request options
        const options = {
            method: 'POST',
            url: 'https://gemini-1-5-flash.p.rapidapi.com/',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '8e3573e266msh59690d31e16a788p15037fjsn91666640a99f',
                'x-rapidapi-host': 'gemini-1-5-flash.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                model: 'gemini-1.5-flash',
                messages: apiMessages,
                max_tokens: 1000,
                temperature: 0.7
            }
        };

        // Make the API request
        const response = await axios.request(options);
        
        console.log('Full API response:', JSON.stringify(response.data, null, 2));

        // Extract the response content based on the actual API response format
        let responseText = '';
        
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            // Standard OpenAI format response
            const choice = response.data.choices[0];
            if (choice.message && choice.message.content) {
                responseText = choice.message.content;
            } else if (choice.text) {
                responseText = choice.text;
            }
        } else if (response.data && response.data.message) {
            // Direct message format
            responseText = response.data.message;
        } else if (response.data && response.data.text) {
            // Direct text format
            responseText = response.data.text;
        } else {
            console.error('Unexpected response format:', response.data);
            responseText = 'Sorry, I could not generate a response at this time.';
        }

        if (!responseText || responseText.trim() === '') {
            responseText = 'Sorry, I could not generate a response. Please try rephrasing your question.';
        }

        console.log('Extracted response text:', responseText);

        res.status(200).json({
            success: true,
            message: responseText,
            timestamp: new Date().toISOString(),
            usage: response.data.usage || null
        });

    } catch (err) {
        console.error('Full error object:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Error message:', err.message);
        
        // Handle different types of errors
        if (err.response) {
            const status = err.response.status;
            const errorData = err.response.data;
            
            switch (status) {
                case 400:
                    return res.status(400).json({
                        success: false,
                        message: "Bad request. Please check your input.",
                        error: "BAD_REQUEST",
                        details: errorData
                    });
                
                case 401:
                    return res.status(401).json({
                        success: false,
                        message: "API authentication failed. Please check your API key.",
                        error: "AUTHENTICATION_FAILED"
                    });
                
                case 429:
                    return res.status(429).json({
                        success: false,
                        message: "Rate limit exceeded. Please try again later.",
                        error: "RATE_LIMIT_EXCEEDED"
                    });
                
                case 500:
                    return res.status(503).json({
                        success: false,
                        message: "The AI service is temporarily unavailable. Please try again later.",
                        error: "SERVICE_UNAVAILABLE"
                    });
                
                default:
                    return res.status(500).json({
                        success: false,
                        message: `API error: ${status}`,
                        error: "API_ERROR",
                        details: process.env.NODE_ENV === 'development' ? errorData : undefined
                    });
            }
        }
        
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            return res.status(503).json({
                success: false,
                message: "Service temporarily unavailable. Please try again later.",
                error: "SERVICE_UNAVAILABLE"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "INTERNAL_SERVER_ERROR",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = solveDoubt;
