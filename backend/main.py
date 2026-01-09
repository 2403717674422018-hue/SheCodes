from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
import os
from openai import OpenAI
from dotenv import load_dotenv
import re
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="TeacherLoggg API",
    description="Secure API for teacher contribution tracking",
    version="1.0.0",
    docs_url=None,  # Disable docs in production
    redoc_url=None
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log error internally but don't expose details
    print(f"Internal error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred"}
    )

# CORS with validation
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    max_age=3600,
)

# MongoDB with connection validation
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'teacherlog_db')

if not MONGO_URL or not DB_NAME:
    raise ValueError("MONGO_URL and DB_NAME must be set")

client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
contributions_collection = db["contributions"]

# Create indexes for performance and security
@app.on_event("startup")
async def create_indexes():
    await contributions_collection.create_index([("date", -1)])
    await contributions_collection.create_index([("created_at", -1)])
    await contributions_collection.create_index([("contribution_type", 1)])

# OpenAI with validation
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY or OPENAI_API_KEY == 'your_openai_api_key_here':
    print("WARNING: OpenAI API key not configured")
    openai_client = None
else:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Models with strict validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Input sanitization
def sanitize_string(value: str, max_length: int = 1000) -> str:
    """Remove potentially dangerous characters and limit length"""
    if not value:
        return value
    # Remove HTML tags and script content
    value = re.sub(r'<[^>]*>', '', value)
    # Remove script tags content
    value = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', value, flags=re.IGNORECASE)
    # Limit length
    return value[:max_length].strip()

class ContributionCreate(BaseModel):
    date: str
    contribution_type: str
    reference: Optional[str] = None
    time_spent: int
    description: str
    input_mode: str = "text"

    @validator('date')
    def validate_date(cls, v):
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except:
            raise ValueError("Invalid date format")

    @validator('contribution_type')
    def validate_contribution_type(cls, v):
        allowed_types = [
            "Student Mentoring", "Project Guidance", "Internship Support",
            "Research Paper Review", "Competition Preparation", "Workshop/Seminar",
            "Academic Event Organization", "Career Guidance", "Course Material Development",
            "Industry Collaboration", "Committee Work", "Curriculum Development",
            "Lab Setup & Maintenance", "Student Counseling", "Placement Activities", "Other"
        ]
        if v not in allowed_types:
            raise ValueError(f"Invalid contribution type: {v}")
        return v

    @validator('reference')
    def validate_reference(cls, v):
        if v:
            return sanitize_string(v, 200)
        return v

    @validator('time_spent')
    def validate_time_spent(cls, v):
        if v < 5 or v > 480:
            raise ValueError("Time spent must be between 5 and 480 minutes")
        if v % 5 != 0:
            raise ValueError("Time spent must be a multiple of 5")
        return v

    @validator('description')
    def validate_description(cls, v):
        if len(v) < 10:
            raise ValueError("Description must be at least 10 characters")
        return sanitize_string(v, 1000)

    @validator('input_mode')
    def validate_input_mode(cls, v):
        if v not in ["text", "voice"]:
            raise ValueError("Input mode must be 'text' or 'voice'")
        return v

class ContributionUpdate(BaseModel):
    date: Optional[str] = None
    contribution_type: Optional[str] = None
    reference: Optional[str] = None
    time_spent: Optional[int] = None
    description: Optional[str] = None

    @validator('date')
    def validate_date(cls, v):
        if v:
            try:
                datetime.fromisoformat(v.replace('Z', '+00:00'))
                return v
            except:
                raise ValueError("Invalid date format")
        return v

    @validator('contribution_type')
    def validate_contribution_type(cls, v):
        if v:
            allowed_types = [
                "Student Mentoring", "Project Guidance", "Internship Support",
                "Research Paper Review", "Competition Preparation", "Workshop/Seminar",
                "Academic Event Organization", "Career Guidance", "Course Material Development",
                "Industry Collaboration", "Committee Work", "Curriculum Development",
                "Lab Setup & Maintenance", "Student Counseling", "Placement Activities", "Other"
            ]
            if v not in allowed_types:
                raise ValueError(f"Invalid contribution type: {v}")
        return v

    @validator('reference')
    def validate_reference(cls, v):
        if v:
            return sanitize_string(v, 200)
        return v

    @validator('time_spent')
    def validate_time_spent(cls, v):
        if v:
            if v < 5 or v > 480:
                raise ValueError("Time spent must be between 5 and 480 minutes")
            if v % 5 != 0:
                raise ValueError("Time spent must be a multiple of 5")
        return v

    @validator('description')
    def validate_description(cls, v):
        if v:
            if len(v) < 10:
                raise ValueError("Description must be at least 10 characters")
            return sanitize_string(v, 1000)
        return v

class ContributionResponse(BaseModel):
    id: str = Field(alias="_id")
    date: str
    contribution_type: str
    reference: Optional[str]
    time_spent: int
    description: str
    input_mode: str
    created_at: datetime

    class Config:
        populate_by_name = True

class SummarizeRequest(BaseModel):
    contributions: List[dict]

    @validator('contributions')
    def validate_contributions(cls, v):
        if not v:
            raise ValueError("Contributions list cannot be empty")
        if len(v) > 1000:
            raise ValueError("Cannot summarize more than 1000 contributions")
        return v

# Routes with rate limiting and validation
@app.get("/api/")
@limiter.limit("100/minute")
async def root(request: Request):
    return {"message": "TeacherLoggg API is running", "version": "1.0.0"}

@app.post("/api/contributions")
@limiter.limit("30/minute")
async def create_contribution(request: Request, contribution: ContributionCreate):
    try:
        contribution_dict = contribution.dict()
        contribution_dict["created_at"] = datetime.utcnow()
        
        result = await contributions_collection.insert_one(contribution_dict)
        
        created = await contributions_collection.find_one({"_id": result.inserted_id})
        created["_id"] = str(created["_id"])
        
        return created
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error creating contribution: {e}")
        raise HTTPException(status_code=500, detail="Failed to create contribution")

@app.get("/api/contributions")
@limiter.limit("100/minute")
async def get_contributions(request: Request):
    try:
        contributions = []
        cursor = contributions_collection.find(
            {},
            {
                "_id": 1,
                "date": 1,
                "contribution_type": 1,
                "reference": 1,
                "time_spent": 1,
                "description": 1,
                "input_mode": 1,
                "created_at": 1
            }
        ).sort("date", -1).limit(1000)
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            contributions.append(doc)
        
        return contributions
    except Exception as e:
        print(f"Error fetching contributions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contributions")

@app.get("/api/contributions/{contribution_id}")
@limiter.limit("100/minute")
async def get_contribution(request: Request, contribution_id: str):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    try:
        contribution = await contributions_collection.find_one({"_id": ObjectId(contribution_id)})
        
        if not contribution:
            raise HTTPException(status_code=404, detail="Contribution not found")
        
        contribution["_id"] = str(contribution["_id"])
        return contribution
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching contribution: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contribution")

@app.put("/api/contributions/{contribution_id}")
@limiter.limit("30/minute")
async def update_contribution(request: Request, contribution_id: str, contribution: ContributionUpdate):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    try:
        update_data = {k: v for k, v in contribution.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await contributions_collection.update_one(
            {"_id": ObjectId(contribution_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contribution not found")
        
        updated = await contributions_collection.find_one({"_id": ObjectId(contribution_id)})
        updated["_id"] = str(updated["_id"])
        
        return updated
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error updating contribution: {e}")
        raise HTTPException(status_code=500, detail="Failed to update contribution")

@app.delete("/api/contributions/{contribution_id}")
@limiter.limit("30/minute")
async def delete_contribution(request: Request, contribution_id: str):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    try:
        result = await contributions_collection.delete_one({"_id": ObjectId(contribution_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Contribution not found")
        
        return {"message": "Contribution deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting contribution: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete contribution")

@app.post("/api/summarize")
@limiter.limit("10/minute")
async def summarize_contributions(request: Request, req: SummarizeRequest):
    if not openai_client:
        raise HTTPException(status_code=503, detail="AI summarization not configured")
    
    try:
        contributions = req.contributions
        
        if not contributions:
            raise HTTPException(status_code=400, detail="No contributions provided")
        
        # Sanitize contribution data
        contrib_text = []
        for c in contributions[:100]:  # Limit to 100 for API token limits
            desc = sanitize_string(c.get('description', ''), 500)
            contrib_type = sanitize_string(c.get('contribution_type', ''), 100)
            contrib_text.append(
                f"- {contrib_type}: {desc} "
                f"({c.get('time_spent', 0)} minutes on {c.get('date', 'N/A')})"
            )
        
        prompt = f"""You are an academic documentation assistant. Generate a professional summary of the following teacher contributions for appraisal and accreditation purposes (NAAC/NBA).

Contributions:
{chr(10).join(contrib_text)}

Create a comprehensive summary that:
1. Categorizes contributions by type
2. Highlights total time invested
3. Emphasizes impact and scope
4. Uses formal academic language
5. Formats it professionally for inclusion in appraisal documents

Summary:"""

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an academic documentation expert specializing in teacher appraisals and accreditation documentation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        summary = response.choices[0].message.content
        
        return {"summary": summary}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate summary")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
