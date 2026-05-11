# JINION-FRAMEWORK

OpenAI / Google Gemini를 백엔드로 사용하는 챗봇 프레임워크입니다.  
FastAPI(Python) 백엔드 + React(TypeScript) 프론트엔드로 구성됩니다.  
파일 첨부는 MinIO 오브젝트 스토리지를 통해 처리됩니다.

> **GitHub:** https://github.com/JeonghyeonKim1995/JINION-FRAMEWORK

---

## 아키텍처

```
client (React + Vite) :5173
    ↓  /api/* 프록시
backend (FastAPI) :8000
    ├── OpenAI API / Google Gemini API  (채팅)
    └── MinIO :9000                      (파일 업로드)
```

---

## 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/JeonghyeonKim1995/JINION-FRAMEWORK.git
cd JINION-FRAMEWORK
```

### 2. MinIO 실행

Docker가 있다면 아래 명령으로 로컬 MinIO를 바로 띄울 수 있습니다.

```bash
docker run -d --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  quay.io/minio/minio server /data --console-address ":9001"
```

MinIO 콘솔: `http://localhost:9001` (ID: `minioadmin` / PW: `minioadmin`)  
버킷은 서버 최초 업로드 시 자동으로 생성됩니다.

### 3. 백엔드 설정

```bash
cd backend

# 패키지 설치
pip install -r requirements.txt

# 환경변수 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 각 항목을 입력합니다.

```env
# 사용할 LLM 제공자: openai | gemini
CHAT_LLM_PROVIDER=openai

# OpenAI 설정
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Gemini 설정 (Gemini 사용 시)
GEMINI_API_KEY=AI...
GEMINI_MODEL=gemini-1.5-flash

# 프론트엔드 CORS 허용 주소
FRONTEND_ORIGIN=http://localhost:5173

# MinIO 설정
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
MINIO_SECURE=false
MINIO_URL_EXPIRE_DAYS=7
```

백엔드 서버 실행:

```bash
uvicorn main:app --reload --port 8000
```

### 4. 프론트엔드 설정

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
│   │   ├── chat.py          # POST /api/chat, DELETE /api/chat/{session_id}
│   │   └── upload.py        # POST /api/upload
│   └── services/
│       ├── llm.py           # OpenAI / Gemini 호출 추상화
│       ├── session.py       # 인메모리 대화 히스토리 관리
│       └── storage.py       # MinIO 파일 업로드
└── client/
    ├── src/
    │   ├── api/
    │   │   ├── chat.ts       # 채팅 API 호출
    │   │   └── upload.ts     # 파일 업로드 API 호출
    │   ├── pages/
    │   │   └── ChatPage.tsx  # 메인 채팅 화면
    │   └── components/
    │       ├── ChatInput.tsx     # 입력창 (📎 첨부, Shift+Enter 줄바꿈)
    │       ├── MessageBubble.tsx # 메시지 말풍선 (이미지/파일 렌더링)
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
| `POST` | `/api/upload` | 파일 업로드 (MinIO) |

### POST /api/chat

**요청**
```json
{
  "session_id": "uuid",
  "message": "안녕하세요",
  "attachments": [
    { "url": "https://...", "name": "파일명.pdf", "type": "application/pdf" }
  ]
}
```

**응답**
```json
{
  "session_id": "uuid",
  "answer": "LLM 응답 텍스트"
}
```

### POST /api/upload

`multipart/form-data` 형식으로 파일을 전송합니다.

**요청**
```
Content-Type: multipart/form-data
file: <업로드할 파일>
```

**응답**
```json
{
  "url": "http://localhost:9000/uploads/uuid.png?...",
  "key": "uuid.png",
  "name": "원본파일명.png",
  "size": 102400,
  "type": "image/png"
}
```

반환된 `url`은 MinIO presigned URL로, 기본 7일간 유효합니다 (`MINIO_URL_EXPIRE_DAYS`로 조정 가능).

---

## LLM 제공자 전환

`.env`의 `CHAT_LLM_PROVIDER` 값만 바꾸고 서버를 재시작합니다.

```env
CHAT_LLM_PROVIDER=openai   # OpenAI 사용
CHAT_LLM_PROVIDER=gemini   # Google Gemini 사용
```

---

## 필수 요건

- Python 3.11+
- Node.js 18+
- MinIO 서버 (로컬 Docker 또는 외부 서버)
- OpenAI API 키 또는 Google Gemini API 키
