# AI Workout Routine Auditor

## Overview
AI Workout Routine Auditor is a full-stack web application designed to help users evaluate the structural balance of their fitness routines. Users can build their training microcycles through a sleek, modern interface, specifying exercises, sets, reps, and RPE. The system then uses an AI agent (powered by Anthropic's Claude) to audit the routine across five key dimensions: Coverage, Volume Distribution, Recovery Spacing, Push/Pull Balance, and Goal-Fit.

## Features
- **Interactive Workout Builder:** Define your experience level, goals, and weekly frequency. Build routines from scratch or start with built-in templates (Push/Pull/Legs, Upper/Lower, Full Body).
- **AI-Powered Audit:** The backend evaluates the submitted routine and provides an overall score out of 10 along with dimension-specific feedback.
- **Deep Dive Elaborations:** Click on any specific feedback point to have the AI elaborate directly with actionable suggestions on how to improve your routine.
- **Modern UI:** Built with Tailwind CSS and custom vanilla CSS, featuring glassmorphism elements, dynamic score gauges, and a fully responsive design.

## Tech Stack
- **Frontend:** HTML, Vanilla CSS, JavaScript, Tailwind CSS (via CDN)
- **Backend:** Python, FastAPI, Uvicorn, HTTPX
- **AI Integration:** Anthropic API

## Setup Instructions

### Prerequisites
- Python 3.8+
- An Anthropic API Key

### Installation & Execution

1. **Clone the repository** (if you haven't already).
   
2. **Navigate to the project directory:**
   ```bash
   cd "BB Agent"
   ```

3. **Install backend dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

5. **Start the Backend Server:**
   ```bash
   python main.py
   ```
   The API will run on `http://0.0.0.0:8000`.

6. **Open the Frontend:**
   Simply open the `Agent.html` file in your preferred web browser to start using the application.

## Project Structure
- `Agent.html` / `Agent.css` - Main frontend UI and styling.
- `api.js` / `constants.js` / `dom.js` / `modal.js` - Modularized frontend JavaScript logic.
- `main.py` - FastAPI backend application containing the endpoints for the Anthropic AI integration.
- `requirements.txt` - Python backend dependencies.

## License
MIT License
