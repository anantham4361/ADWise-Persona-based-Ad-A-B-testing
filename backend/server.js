import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

import { generatePersona } from './services/persona.js';
import { evaluateAds } from './services/evaluator.js';
import { evaluateVideoAds } from './services/videoEvaluator.js';
import { evaluateTextAds } from './services/textEvaluator.js';
import { validatePersonaRequest, validateAdUpload, validateVideoUpload, validateTextAds } from './middleware/validation.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://adwise-backend-5q0u.onrender.com'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fieldName = file.fieldname;
    const extension = path.extname(file.originalname);
    cb(null, `${fieldName}_${timestamp}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP images and MP4, MOV, AVI, MKV, WebM videos are allowed'), false);
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Persona-Based Ad A/B Testing API is running!' });
});

app.post('/generate-persona', validatePersonaRequest, async (req, res) => {
  try {
    const { prompt } = req.body;
    const persona = await generatePersona(prompt);
    res.json({ persona });
  } catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ 
      detail: `Failed to generate persona: ${error.message}` 
    });
  }
});

// Image ads evaluation
app.post('/evaluate-ads', 
  upload.fields([
    { name: 'ad_a', maxCount: 1 },
    { name: 'ad_b', maxCount: 1 }
  ]),
  validateAdUpload,
  async (req, res) => {
    try {
      const { persona_prompt } = req.body;
      const adAFile = req.files['ad_a'][0];
      const adBFile = req.files['ad_b'][0];

      // Generate persona and evaluate ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateAds(persona, adAFile.path, adBFile.path);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate ads: ${error.message}` 
      });
    }
  }
);

// Video ads evaluation
app.post('/evaluate-video-ads',
  upload.fields([
    { name: 'ad_a', maxCount: 1 },
    { name: 'ad_b', maxCount: 1 }
  ]),
  validateVideoUpload,
  async (req, res) => {
    try {
      const { persona_prompt } = req.body;
      const adAFile = req.files['ad_a'][0];
      const adBFile = req.files['ad_b'][0];

      // Generate persona and evaluate video ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateVideoAds(persona, adAFile.path, adBFile.path);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating video ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate video ads: ${error.message}` 
      });
    }
  }
);

// Text ads evaluation - Fixed to use upload.none() for processing multipart form data
app.post('/evaluate-text-ads',
  upload.none(), // This processes multipart form data without files
  validateTextAds,
  async (req, res) => {
    try {
      const { persona_prompt, ad_a_text, ad_b_text } = req.body;

      // Generate persona and evaluate text ads
      const persona = await generatePersona(persona_prompt);
      const evaluation = await evaluateTextAds(persona, ad_a_text, ad_b_text);

      res.json(evaluation);
    } catch (error) {
      console.error('Error evaluating text ads:', error);
      res.status(500).json({ 
        detail: `Failed to evaluate text ads: ${error.message}` 
      });
    }
  }
);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ detail: 'File size too large. Maximum size is 100MB.' });
    }
  }
  
  if (error.message.includes('Only JPEG, PNG, WebP')) {
    return res.status(400).json({ detail: error.message });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ detail: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ detail: 'Endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});