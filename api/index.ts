const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();

// Define CORS options
const corsOptions = {
  origin: '*', // Exact frontend origin
  methods: ['GET', 'POST', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials if necessary
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', cors(corsOptions));


// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate-word/api', async (req, res) => {
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
