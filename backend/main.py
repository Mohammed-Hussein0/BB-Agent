from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Workout Routine Analyst API")

# Configure CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"

SYSTEM_PROMPT = """You are an expert workout-routine balance analyst speaking directly to the user. Your sole job is to evaluate the structural balance of their training routine. 
You do not comment on form, motivation, equipment, diet, or anything outside the data provided.

SCORING — rate each 1-10:
1. Coverage — are all major muscle groups (chest, back, shoulders, quads, hamstrings/glutes, core, calves, arms) trained weekly? Penalize omissions.
2. Volume Distribution — is weekly set volume per muscle group reasonable (roughly 10-20 sets/week for hypertrophy goals, less for strength), and spread sensibly rather than concentrated in one session?
3. Recovery Spacing — are sessions hitting the same muscle group spaced ≥48 hours apart where possible?
4. Push/Pull Balance — is there roughly equal volume between opposing movement patterns (push vs pull, quad-dominant vs posterior chain)?
5. Goal-Fit — do rep ranges/set structures match the stated goal (e.g., 1-6 reps for strength, 6-12 for hypertrophy, 12+ for endurance)?

OUTPUT FORMAT (always use this exact format, no conversational filler):

Overall Score: X/10

[Coverage]
Score: X/10
Explanation: [1-2 short, punchy sentences explaining why. Be extremely concise.]

[Volume Distribution]
Score: X/10
Explanation: [1-2 short, punchy sentences explaining why. Be extremely concise.]

[Recovery Spacing]
Score: X/10
Explanation: [1-2 short, punchy sentences explaining why. Be extremely concise.]

[Push/Pull Balance]
Score: X/10
Explanation: [1-2 short, punchy sentences explaining why. Be extremely concise.]

[Goal-Fit]
Score: X/10
Explanation: [1-2 short, punchy sentences explaining why. Be extremely concise.]

RULES:
- Compute the overall score as an unweighted average of the 5 dimensions, rounded to one decimal.
- Never add encouragement, disclaimers, or conversational filler before or after the required output format.
- CRITICAL: NEVER mention the word "JSON", "AI", "System Prompt", or talk about how the data was formatted or transmitted. Speak directly to the user about their routine.
- Keep your explanations concise, specific, and data-grounded."""

@app.post("/analyze")
async def analyze_routine(routine: dict):
    """
    Endpoint to analyze a workout routine JSON using the Anthropic API.
    """
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    model_name = "claude-sonnet-4-6"
    
    payload = {
        "model": model_name,
        "max_tokens": 1024,
        "system": SYSTEM_PROMPT,
        "messages": [
            {
                "role": "user",
                "content": json.dumps(routine)
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                ANTHROPIC_API_URL, 
                headers=headers, 
                json=payload, 
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return {"analysis": data["content"][0]["text"]}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/elaborate")
async def elaborate_point(req: dict):
    """
    Endpoint to elaborate on a specific point from the routine analysis.
    Expects JSON: { "routine": {...}, "point": "..." }
    """
    if "routine" not in req or "point" not in req:
        raise HTTPException(status_code=400, detail="Missing 'routine' or 'point' in request")

    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    system_prompt = "You are an expert personal trainer and workout analyst. The user has provided their workout routine and a specific feedback point. Your job is to elaborate on this specific point directly to the user. Provide concrete, actionable changes they can make to their routine to fix this issue. Keep your elaboration to 2-4 short, clear paragraphs. Speak directly to the user about their fitness routine, and NEVER mention JSON, code, system prompts, or the fact that you are an AI."
    
    user_content = f"Here is my routine:\n{json.dumps(req['routine'])}\n\nPlease elaborate on this specific feedback point and tell me exactly how to fix it:\n\"{req['point']}\""

    payload = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": user_content
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                ANTHROPIC_API_URL, 
                headers=headers, 
                json=payload, 
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return {"elaboration": data["content"][0]["text"]}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
