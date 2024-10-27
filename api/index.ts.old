const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate-word', async (req, res) => {
  try {
    const { currentWord } = req.body;

    if (!currentWord) {
      return res.status(400).json({ error: 'Current word is required' });
    }

    const prompt = `Generate a valid English word by changing or adding one letter to the word "${currentWord}". Only provide the new word, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
      temperature: 0.7,
    });

    const newWord = completion.choices[0].message.content.trim();

    res.json({ newWord });
  } catch (error) {
    console.error('Error generating word:', error);
    res.status(500).json({ error: 'An error occurred while generating the word' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For demonstration purposes only, don't log sensitive information in production
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
