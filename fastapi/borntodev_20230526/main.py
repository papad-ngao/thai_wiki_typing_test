from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from bson.objectid import ObjectId

app = FastAPI()

client = MongoClient("mongodb://localhost:27017/")
db = client["wikis"]
collection = db["info"]

class Vote(BaseModel):
    name: str
    count: int

@app.get("/")
async def root():
    return { "message": "Hello World" }

# Create
@app.post('/wikis')
async def create_vote(vote: Vote):
    result = collection.insert_one(vote.dict())
    return {
        "id": str(result.inserted_id),
        "name": vote.name,
        "count": vote.count
    }

#Read
@app.get("/wikis/{wiki_id}")
async def read_wiki(wiki_id: str):
    wiki = collection.find_one({ "_id": ObjectId(wiki_id) })
    if wiki:
        return { "id": str(wiki), "name": wiki["name"], "count": wiki["count"] }
    else:
        raise HTTPException(status_code=404, detail="Wiki not found")

#Update
@app.put("/wikis/{wiki_id}")
async def update_wiki(wiki_id: str, wiki: Vote):
    result = collection.update_one(
        { "_id": ObjectId(wiki_id) },
        { "$set": wiki.dict(exclude_unset=True) }
    )
    if result.modified_count == 1:
        return {
            "id": wiki_id,
            "name": wiki.name,
            "count": wiki.count
        }