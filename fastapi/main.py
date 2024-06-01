from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Data
from pythainlp.tokenize import word_tokenize
from pymongo import MongoClient
from pydantic import BaseModel
from bson.objectid import ObjectId
import random

app = FastAPI()

client = MongoClient("mongodb://localhost:27017/")
db = client["wikis"]
collection = db["info"]

class Article(BaseModel):
    title: str
    content: dict
    word_num: int
    created_time: str

class Entry(BaseModel):
    id: str
    updated: dict

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
async def root():
    return {
        "message": "root"
    }

# Create
@app.post('/insert')
async def create_article(article: Article):
    result = collection.insert_one(article.dict())
    return {
        "id": str(result.inserted_id),
        "title": article.title,
        "content": article.content,
        "word_num": article.word_num,
        "created_time": article.created_time
    }

'''
        { "_id": ObjectId(wiki_id) },
        { "$set": wiki.dict(exclude_unset=True) }
'''

@app.post("/update")
async def update_wiki(entry: Entry):
    result = collection.update_one(
        { "_id": ObjectId(entry.id) },
        { "$set": entry.updated })
    return {
        "id": entry.id,
        "title": entry.updated["title"],
        "content": entry.updated["content"],
        "word_num": entry.updated["word_num"],
        "created_time": entry.updated["created_time"]
    }

#Read
@app.get("/wikis/{wiki_id}")
async def read_wiki(wiki_id: str):
    wiki = collection.find_one({ "_id": ObjectId(wiki_id) })
    if wiki:
        return {
            "_id": str(wiki["_id"]),
            "title": wiki["title"],
            "content": wiki["content"],
            "word_num": wiki["word_num"]
        }
    else:
        raise HTTPException(status_code=404, detail="Wiki not found")


@app.post("/wikis")
async def read_wiki(data: Data):
    mod_dt = data.info
    mod_dt_val = mod_dt["length_condition"]
    wiki = collection.find()
    if wiki:
        ret_dict = {
        }
        idx = 0
        for i in wiki:
            print(i)
            if (
                (i["word_num"] >= int(mod_dt_val.split('-')[0]))
                and (i["word_num"] <= int(mod_dt_val.split('-')[1]))
            ):
                ret_dict[idx] = {
                    "_id": str(i["_id"]),
                    "title": str(i["title"]),
                    "word_num": str(i["word_num"]),
                    "created_time": i["created_time"]
                }
                idx += 1
        return ret_dict
    else:
        raise HTTPException(status_code=404, detail="Wiki not found")

def count_doc(collections_dict, range_str):
    idx = 0
    for i in collections_dict:
        if (
            (i["word_num"] >= int(range_str.split('-')[0]))
            and (i["word_num"] <= int(range_str.split('-')[1]))):
            idx += 1
    return idx

def count_and_pick_doc(collections_dict, range_str):
    ret_dict = {}
    idx = 1
    for i in collections_dict:
        if (
            (i["word_num"] >= int(range_str.split('-')[0]))
            and (i["word_num"] <= int(range_str.split('-')[1]))):
            ret_dict[idx] = {
                "_id": str(i["_id"]),
                "title": str(i["title"]),
                "word_num": str(i["word_num"]),
                "created_time": i["created_time"]
            }
            idx += 1
    return ret_dict


@app.post("/stats")
async def get_wiki_stats(data: Data):
    mod_dt = data.info
    mod_dt_val = mod_dt["length_condition_set"]
    wiki = collection.find()
    if wiki:
        idx_str = ''
        for i in mod_dt_val.split(' '):
            wiki_instance = collection.find()
            print(('=' * 60) + i)
            idx_str += ',' + str(count_doc(wiki_instance, i))
        idx_str = (''
            + 'short x '
            + idx_str[1:].split(',')[0]
            + ' // medium x '
            + idx_str[1:].split(',')[1]
            + ' // long x '
            + idx_str[1:].split(',')[2]
            + ' // very long x'
            + idx_str[1:].split(',')[3])
        return idx_str
    else:
        raise HTTPException(status_code=404, detail="Wiki not found")

@app.post("/pickarticle")
async def get_wiki_pick(data: Data):
    mod_dt = data.info
    mod_dt_val = mod_dt["length_condition"]
    wiki = collection.find()
    if wiki:
        count_res = count_doc(wiki, mod_dt_val)
        wiki_instance= collection.find()
        target_num = str(random.randint(1, count_res))
        obj = count_and_pick_doc(wiki_instance, mod_dt_val)
        wiki_picked = collection.find_one({ "_id": ObjectId(obj[int(target_num)]["_id"]) })
        # wiki_picked = obj[int(target_num)]["_id"]
        ret_dict = {
            "msg": (''
                + target_num
                + '/'
                + str(count_res)),
            "picked_obj": {
                "_id": str(wiki_picked["_id"]),
                "title": wiki_picked["title"],
                "content": wiki_picked["content"],
                "word_num": wiki_picked["word_num"]
            },
            "obj": obj
        }
        return ret_dict
    else:
        raise HTTPException(status_code=404, detail='Wiki not found')

@app.post("/remove")
async def delete_picked_article(data: Data):
    mod_dt = data.info
    wiki = collection.delete_one({ "_id": ObjectId(mod_dt) })
    if wiki:
        return mod_dt
    else:
        raise HTTPException


@app.post('/')
async def gen(data: Data):
    mod_dt = data.info
    ret_str = ''
    dc_key = mod_dt.keys()
    ret_dc = {}
    for i in dc_key:
        if i[len(i) - 2:] == 'ty':
            ret_dc[i] = '-'.join(word_tokenize(
                mod_dt[i], engine='newmm'
            ))
        else:
            ret_dc[i] = mod_dt[i]
    ret_str += str(ret_dc)
    return ret_dc
