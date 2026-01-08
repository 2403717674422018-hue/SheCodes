from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
import os
from openai import OpenAI

app = FastAPI()

# CORS
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
contributions_collection = db["contributions"]

# OpenAI
openai_client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Models
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

class ContributionCreate(BaseModel):
    date: str
    contribution_type: str
    reference: Optional[str] = None
    time_spent: int
    description: str
    input_mode: str = "text"

class ContributionUpdate(BaseModel):
    date: Optional[str] = None
    contribution_type: Optional[str] = None
    reference: Optional[str] = None
    time_spent: Optional[int] = None
    description: Optional[str] = None

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

# Routes
@app.get("/api/")
async def root():
    return {"message": "TeacherLoggg API is running"}

@app.post("/api/contributions")
async def create_contribution(contribution: ContributionCreate):
    contribution_dict = contribution.dict()
    contribution_dict["created_at"] = datetime.utcnow()
    
    result = await contributions_collection.insert_one(contribution_dict)
    
    created = await contributions_collection.find_one({"_id": result.inserted_id})
    created["_id"] = str(created["_id"])
    
    return created

@app.get("/api/contributions")
async def get_contributions():
    contributions = []
    cursor = contributions_collection.find().sort("date", -1)
    
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        contributions.append(doc)
    
    return contributions

@app.get("/api/contributions/{contribution_id}")
async def get_contribution(contribution_id: str):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    contribution = await contributions_collection.find_one({"_id": ObjectId(contribution_id)})
    
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    contribution["_id"] = str(contribution["_id"])
    return contribution

@app.put("/api/contributions/{contribution_id}")
async def update_contribution(contribution_id: str, contribution: ContributionUpdate):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
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

@app.delete("/api/contributions/{contribution_id}")
async def delete_contribution(contribution_id: str):
    if not ObjectId.is_valid(contribution_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await contributions_collection.delete_one({"_id": ObjectId(contribution_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    return {"message": "Contribution deleted successfully"}

@app.post("/api/summarize")
async def summarize_contributions(request: SummarizeRequest):
    try:
        contributions = request.contributions
        
        if not contributions:
            raise HTTPException(status_code=400, detail="No contributions provided")
        
        # Prepare contribution text
        contrib_text = []
        for c in contributions:
            contrib_text.append(
                f"- {c['contribution_type']}: {c['description']} "
                f"({c['time_spent']} minutes on {c['date']})"
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
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
