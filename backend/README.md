# Persona-Based Ad A/B Testing Backend (Node.js)

A Node.js/Express backend for the Persona-Based Ad A/B Testing application supporting image, video, and text advertisement analysis using Google Gemini API.

## Features

- **Persona Generation**: Uses Google Gemini Pro to generate detailed user personas
- **Multi-Media Ad Evaluation**: AI-powered evaluation of ads across three formats:
  - **Image Ads**: Visual analysis using Gemini Pro Vision
  - **Video Ads**: Video content analysis and evaluation
  - **Text Ads**: Copywriting and messaging analysis
- **File Upload**: Handles image and video uploads with validation and storage
- **CORS Support**: Configured for frontend communication
- **Error Handling**: Comprehensive error handling and validation
- **Modular Architecture**: Clean separation of concerns with services and middleware

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

3. **Start the server**:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:8000`

## API Endpoints

### `GET /`
Health check endpoint

### `POST /generate-persona`
Generate a detailed persona from natural language input
- **Body**: `{ "prompt": "string" }`
- **Response**: `{ "persona": {...} }`

### `POST /evaluate-ads`
Evaluate two image ads against a generated persona
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `persona_prompt`: string
  - `ad_a`: image file (JPEG, PNG, WebP)
  - `ad_b`: image file (JPEG, PNG, WebP)
- **Response**: Complete evaluation results

### `POST /evaluate-video-ads`
Evaluate two video ads against a generated persona
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `persona_prompt`: string
  - `ad_a`: video file (MP4, MOV, AVI, MKV, WebM)
  - `ad_b`: video file (MP4, MOV, AVI, MKV, WebM)
- **Response**: Complete evaluation results

### `POST /evaluate-text-ads`
Evaluate two text ads against a generated persona
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `persona_prompt`: string
  - `ad_a_text`: string (advertisement copy)
  - `ad_b_text`: string (advertisement copy)
- **Response**: Complete evaluation results

## Project Structure

```
backend/
├── server.js              # Main Express application
├── services/
│   ├── persona.js         # Persona generation logic
│   ├── evaluator.js       # Image ad evaluation logic
│   ├── videoEvaluator.js  # Video ad evaluation logic
│   └── textEvaluator.js   # Text ad evaluation logic
├── middleware/
│   └── validation.js      # Request validation middleware
├── uploads/               # Uploaded files storage
├── package.json
├── .env.example
└── README.md
```

## Evaluation Criteria

All ad types are evaluated on 6 streamlined criteria:

1. **Visual Attention Grab** / **Headline Impact** (for text)
2. **Message Clarity**
3. **Emotional Engagement**
4. **Brand Recall**
5. **Health Appeal**
6. **Uniqueness**

Each criterion is scored 1-10, with detailed explanations provided for the winning ad.

## Environment Variables

```
GOOGLE_API_KEY=your_google_gemini_api_key_here
PORT=8000
```

## File Limits

- **Images**: 10MB maximum (JPEG, PNG, WebP)
- **Videos**: 100MB maximum (MP4, MOV, AVI, MKV, WebM)
- **Text**: No file size limit (minimum 10 characters per ad)

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **express-validator**: Request validation
- **@google/generative-ai**: Google Gemini API client

## Notes

- Video analysis currently uses text-based evaluation due to API limitations
- For production use, consider implementing actual video frame extraction and analysis
- Text ads receive specialized copywriting-focused evaluation criteria
- All file uploads are stored in the `/uploads` directory
- Reduced criteria set improves response time and reduces token usage