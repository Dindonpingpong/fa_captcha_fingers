from fastapi import FastAPI, File, UploadFile
from recognize_image import recognize
import uuid
import base64
import numpy as np

app = FastAPI()

@app.post("/fingers/")
async def create_upload_file(file: UploadFile = File(...)):

    path = f"tmp/{str(uuid.uuid4())}"

    with open(path, "wb+") as file_object:
        file_object.write(file.file.read())

    return {
        "fingers": recognize(path)
    }

@app.get("/fingers/")
async def get_fingers():
    
    return {
        "fingers": 1
    }

@app.post("/files/")
async def create_file(image: UploadFile = File(...)):
    print(image)

    return {"file_size": "check"}