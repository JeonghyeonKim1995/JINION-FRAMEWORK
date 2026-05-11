from __future__ import annotations
import os

PROVIDER = os.getenv("CHAT_LLM_PROVIDER", "openai").lower()


async def complete(history: list[dict], user_message: str) -> str:
    messages = history + [{"role": "user", "content": user_message}]
    if PROVIDER == "gemini":
        return await _gemini(messages)
    return await _openai(messages)


async def _openai(messages: list[dict]) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    res = await client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=messages,
    )
    return res.choices[0].message.content or ""


async def _gemini(messages: list[dict]) -> str:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))

    history = [
        {
            "role": "user" if m["role"] == "user" else "model",
            "parts": [m["content"]],
        }
        for m in messages[:-1]
    ]
    chat = model.start_chat(history=history)
    res = await chat.send_message_async(messages[-1]["content"])
    return res.text
