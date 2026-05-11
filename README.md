# JINION-FRAMEWORK

OpenAI / Google Gemini를 백엔드로 사용하는 챗봇 프레임워크입니다.  
FastAPI(Python) 백엔드 + React(TypeScript) 프론트엔드로 구성됩니다.

---

## 아키텍처

```
client (React + Vite) :5173
    ↓  /api/* 프록시
backend (FastAPI) :8000
    ↓
OpenAI API / Google Gemini API
```

---

## 빠른 시작

### 1. 저장소 클론

```bash
git clone <repo-url>
cd JINION-FRAMEWORK
```

### 2. 백엔드 설정

```bash
cd backend

# 패키지 설치
pip install -r requirements.txt

# 환경변수 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 API 키를 입력합니다.

```env
# 사용할 LLM 제공자: openai | gemini
CHAT_LLM_PROVIDER=openai

# OpenAI 설정
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Gemini 설정 (Gemini 사용 시)
GEMINI_API_KEY=AI...
GEMINI_MODEL=gemini-1.5-flash

# 프론트엔드 CORS 허용 주소 (기본값 그대로 사용 가능)
FRONTEND_ORIGIN=http://localhost:5173
```

백엔드 서버 실행:

```bash
uvicorn main:app --reload --port 8000
```

### 3. 프론트엔드 설정

```bash
cd client

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

---

## 프로젝트 구조

```
JINION-FRAMEWORK/
├── backend/
│   ├── main.py              # FastAPI 앱 진입점, CORS 설정
│   ├── requirements.txt     # Python 의존성
│   ├── .env.example         # 환경변수 템플릿
│   ├── routers/
│   │   └── chat.py          # POST /api/chat, DELETE /api/chat/{session_id}
│   └── services/
│       ├── llm.py           # OpenAI / Gemini 호출 추상화
│       └── session.py       # 인메모리 대화 히스토리 관리
└── client/
    ├── src/
    │   ├── api/chat.ts       # 백엔드 API 호출
    │   ├── pages/
    │   │   └── ChatPage.tsx  # 메인 채팅 화면
    │   └── components/
    │       ├── ChatInput.tsx     # 입력창 (Shift+Enter 줄바꿈)
    │       ├── MessageBubble.tsx # 메시지 말풍선
    │       └── MessageList.tsx   # 메시지 목록 (자동 스크롤)
    └── vite.config.ts        # /api → :8000 프록시 설정
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/health` | 헬스체크 |
| `POST` | `/api/chat` | 메시지 전송 |
| `DELETE` | `/api/chat/{session_id}` | 세션 히스토리 초기화 |

### POST /api/chat

**요청**
```json
{
  "session_id": "optional-uuid",
  "message": "안녕하세요"
}
```

**응답**
```json
{
  "session_id": "생성된-uuid",
  "answer": "LLM 응답 텍스트"
}
```

---

## LLM 제공자 전환

`.env`의 `CHAT_LLM_PROVIDER` 값만 바꾸면 됩니다.

```env
# OpenAI 사용
CHAT_LLM_PROVIDER=openai

# Gemini 사용
CHAT_LLM_PROVIDER=gemini
```

서버를 재시작하면 적용됩니다.

---

## 필수 요건

- Python 3.11+
- Node.js 18+
- OpenAI API 키 또는 Google Gemini API 키
