const axios = require('axios');

const generateInterviewQuestions = async (req, res) => {
  const { role, techStack, level } = req.body;

  if (!role || !techStack || !level) {
    return res.status(400).json({ success: false, error: 'Please provide role, techStack, and level' });
  }

  const prompt = `Generate 10 ${level} level interview questions with answers for a ${role} focusing on ${techStack}.`;

  const options = {
    method: 'POST',
    url: 'https://gemini-1-5-flash.p.rapidapi.com/',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'gemini-1-5-flash.p.rapidapi.com', 
      'Content-Type': 'application/json',
    },
    data: {
      model: 'gemini-1.5-flash',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    const result = response.data;

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate interview questions' });
  }
};

module.exports = generateInterviewQuestions;
 
