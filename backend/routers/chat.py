from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel
from services import llm, session

router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    answer: str


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    history = session.get_history(req.session_id)
    answer  = await llm.complete(history, req.message)
    session.append(req.session_id, req.message, answer)
    return ChatResponse(session_id=req.session_id, answer=answer)


@router.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    session.clear(session_id)
    return {"cleared": session_id}
