# ADWise: Persona based Ad A/B testing

A full-stack web application that uses AI to generate detailed user personas and evaluate ad performance through comprehensive A/B testing analysis across different media types.

## Brief Idea about the Plan

This application aims to provide marketers and advertisers with an AI-powered tool to test the effectiveness of their ad creatives against specific target personas. By generating detailed user personas and evaluating image, video, and text ads based on a streamlined set of criteria, the tool helps identify the most impactful ad for a given audience, optimizing campaign performance and reducing guesswork.

## Process Flow Diagram

```mermaid
graph TD
    A[User provides Persona Prompt] --> B{Select Ad Type};
    B -- Image --> C[Upload Ad A Image & Ad B Image];
    B -- Video --> D[Upload Ad A Video & Ad B Video];
    B -- Text --> E[Input Ad A Text & Ad B Text];

    C --> F[Frontend sends data to Backend];
    D --> F;
    E --> F;

    F --> G{Backend: Validate Inputs};
    G -- Valid --> H[Backend: Generate Persona (AI)];
    H --> I{Backend: Evaluate Ads (AI)};
    I -- Image Ads --> J[AI analyzes images];
    I -- Video Ads --> K[AI video descriptions];
    I -- Text Ads --> L[AI analyzes text copy];

    J --> M[Backend: Compile Evaluation Results];
    K --> M;
    L --> M;

    M --> N[Backend sends Results to Frontend];
    N --> O[Frontend: Display Persona & Evaluation Results];
    O --> P[User reviews Scores, Winner & Explanation];
```

## Module Descriptions

### Frontend
The frontend module is built with React.js and provides the user interface for interacting with the application. It handles:
*   **User Input**: Collecting the persona description and allowing users to select the ad type (image, video, or text).
*   **File Uploads**: Managing the upload of image and video files for A/B testing.
*   **Text Input**: Providing text areas for entering ad copy for text ad evaluation.
*   **API Communication**: Sending user inputs and ad data to the backend for processing.
*   **Results Display**: Visualizing the generated persona details, detailed ad evaluation scores, and the winning ad with an explanation using charts and tables.

### Backend
The backend module is a Node.js/Express application that serves as the API for the frontend. It is responsible for:
*   **API Endpoints**: Exposing endpoints for persona generation and ad evaluation for different media types.
*   **Request Validation**: Ensuring that incoming requests have the necessary data and adhere to specified formats and constraints.
*   **File Handling**: Receiving and temporarily storing uploaded image and video files.
*   **Persona Generation**: Utilizing the AI to create detailed user personas based on natural language prompts.
*   **Ad Evaluation**:
    *   **Image Ads**: Using the AI to analyze and score image advertisements against the generated persona (Requires paid version of AI models).
    *   **Video Ads**: Using the AI to evaluate video advertisements based on their descriptions and typical video ad elements (requires paid versions of AI models).
    *   **Text Ads**: Using the AI (AI via API : Google gemini-2.5-flash) to analyze and score text-based advertisements, focusing on copywriting and messaging effectiveness.
*   **Error Handling**: Providing robust error handling for API requests and external service calls.

## Tech Stack

### Frontend
*   **React.js** with TypeScript: For building dynamic and interactive user interfaces.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development and styling.
*   **Recharts**: A composable charting library for React, used for data visualization (bar charts, radar charts).
*   **React Dropzone**: A component for handling drag-and-drop file uploads.
*   **Axios**: A promise-based HTTP client for making API requests to the backend.
*   **Lucide React**: A collection of open-source icons for clear visual communication.
*   **Vite**: A fast build tool for modern web projects.

### Backend
*   **Node.js** with Express: A robust and flexible web application framework for building the API.
*   **Google Gemini API (`@google/generative-ai`)**: For AI-powered persona generation (gemini-2.5-flash) and text ad evaluation (gemini-2.5-flash, image and video not implemented yet).
*   **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
*   **Express-validator**: Middleware for request data validation.

## Architecture

The application follows a client-server architecture.

*   **Frontend (Client)**: A React.js single-page application (SPA) that runs in the user's browser. It is responsible for presenting the UI, capturing user input, and displaying results. All interactions with the AI models are proxied through the backend.
*   **Backend (Server)**: A Node.js/Express API server. It acts as an intermediary between the frontend and the Google Gemini API. It receives requests from the frontend, performs necessary validations, interacts with the Google Gemini API for persona generation and ad evaluation, processes the AI responses, and sends structured results back to the frontend. The backend also handles file uploads, temporarily storing image and video files for AI processing.

This separation of concerns allows for independent development and scaling of the frontend and backend, and centralizes the sensitive API key management on the server side.

## Setup Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   Google Gemini API Key

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file by copying the example and add your Google Gemini API key:
    ```bash
    cp .env.example .env
    # Edit .env and add your GOOGLE_API_KEY
    ```

4.  Start the backend server:
    ```bash
    # Development mode with auto-reload
    npm run dev

    # Production mode
    npm start
    ```
    The backend will be available at `http://localhost:8000`

### Frontend Setup

1.  Navigate to the root directory of the project (if you are in `backend`, go up one level):
    ```bash
    cd ..
    ```

2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`

## Usage

1.  **Enter Persona Description**: Provide a natural language description of your target persona in the input field.
    *   Example: "I am a 25-year-old fitness enthusiast who loves healthy food, prefers bright colors, and has an active lifestyle."
2.  **Select Ad Type**: Choose between 'Image Ads', 'Video Ads', or 'Text Ads'.
3.  **Upload/Input Ads**:
    *   For Image/Video Ads: Drag and drop or select two ad files (Ad A and Ad B).
    *   For Text Ads: Enter the copy for Text Ad A and Text Ad B.
4.  **Analyze**: Click the "Analyze Ads" button to start the evaluation.
5.  **Review Results**:
    *   View the generated persona details.
    *   Compare scores across all 6 criteria in a table and visual charts.
    *   See the clear winner determination with a detailed AI-generated explanation.

## API Endpoints

### `GET /`
Health check endpoint.

### `POST /generate-persona`
Generate a detailed persona from natural language input.
- **Body**: `{ "prompt": "string" }`
- **Response**: `{ "persona": {...} }`

### `POST /evaluate-ads`
Evaluate two image ads against a generated persona.
- **Content-Type**: `multipart/form-data`
- **Fields**:
    - `persona_prompt`: string
    - `ad_a`: image file (JPEG, PNG, WebP)
    - `ad_b`: image file (JPEG, PNG, WebP)
- **Response**: Complete evaluation results

### `POST /evaluate-video-ads`
Evaluate two video ads against a generated persona.
- **Content-Type**: `multipart/form-data`
- **Fields**:
    - `persona_prompt`: string
    - `ad_a`: video file (MP4, MOV, AVI, MKV, WebM)
    - `ad_b`: video file (MP4, MOV, AVI, MKV, WebM)
- **Response**: Complete evaluation results

### `POST /evaluate-text-ads`
Evaluate two text ads against a generated persona.
- **Content-Type**: `multipart/form-data`
- **Fields**:
    - `persona_prompt`: string
    - `ad_a_text`: string (advertisement copy)
    - `ad_b_text`: string (advertisement copy)
- **Response**: Complete evaluation results

## Evaluation Criteria

All ad types are evaluated on 6 streamlined criteria, scored 1-10, with detailed explanations provided for the winning ad:

1.  **Visual Attention Grab** / **Headline Impact** (for text ads)
2.  **Message Clarity**
3.  **Emotional Engagement**
4.  **Brand Recall**
5.  **Health Appeal**
6.  **Uniqueness**

## File Limits

*   **Images**: 10MB maximum (JPEG, PNG, WebP)
*   **Videos**: 100MB maximum (MP4, MOV, AVI, MKV, WebM)
*   **Text**: No file size limit (minimum 10 characters per ad)

## Dependencies

### Backend
*   `express`: Web framework
*   `cors`: Cross-origin resource sharing
*   `multer`: File upload handling
*   `axios`: HTTP client for API requests
*   `dotenv`: Environment variable management
*   `express-validator`: Request validation
*   `@google/generative-ai`: Google Gemini API client
*   `nodemon` (dev dependency): For automatic server restarts during development

### Frontend
*   `react`, `react-dom`: Core React libraries
*   `lucide-react`: Icons
*   `axios`: HTTP client
*   `recharts`: Charting library
*   `react-dropzone`: File upload component
*   `autoprefixer`, `postcss`, `tailwindcss` (dev dependencies): For Tailwind CSS processing
*   `vite`, `@vitejs/plugin-react` (dev dependencies): Build tool and React plugin
*   `typescript`, `eslint`, `@types/react`, `@types/react-dom`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `typescript-eslint` (dev dependencies): For development tooling and linting

## Notes

*   Image and Video analysis currently uses text-based evaluation due to Google Gemini API limitations for direct video content analysis. For production use requiring deep video analysis, consider implementing actual video frame extraction and analysis using specialized tools.
*   Text ads receive specialized copywriting-focused evaluation criteria.
*   All file uploads are temporarily stored in the `/uploads` directory on the backend.
