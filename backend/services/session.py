from __future__ import annotations
from collections import defaultdict

_store: dict[str, list[dict]] = defaultdict(list)
MAX_TURNS = 20


def get_history(session_id: str) -> list[dict]:
    return list(_store[session_id])


def append(session_id: str, user_msg: str, assistant_msg: str) -> None:
    _store[session_id].append({"role": "user",      "content": user_msg})
    _store[session_id].append({"role": "assistant", "content": assistant_msg})
    if len(_store[session_id]) > MAX_TURNS * 2:
        _store[session_id] = _store[session_id][-MAX_TURNS * 2:]


def clear(session_id: str) -> None:
    _store.pop(session_id, None)
