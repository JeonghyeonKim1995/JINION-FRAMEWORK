from __future__ import annotations
from fastapi import APIRouter, File, HTTPException, UploadFile
from services import storage

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    data = await file.read()
    try:
        result = await storage.upload(
            filename=file.filename or "file",
            data=data,
            content_type=file.content_type or "application/octet-stream",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result
