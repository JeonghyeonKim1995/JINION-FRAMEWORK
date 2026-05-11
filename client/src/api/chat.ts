export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  session_id: string
  answer: string
}

export async function sendMessage(
  sessionId: string,
  message: string,
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
  const data: ChatResponse = await res.json()
  return data.answer
}
