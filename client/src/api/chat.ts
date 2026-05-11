export interface Attachment {
  url: string
  name: string
  type: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
}

export interface ChatResponse {
  session_id: string
  answer: string
}

export async function sendMessage(
  sessionId: string,
  message: string,
  attachments?: Attachment[],
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      ...(attachments?.length ? { attachments } : {}),
    }),
  })
  if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
  const data: ChatResponse = await res.json()
  return data.answer
}
