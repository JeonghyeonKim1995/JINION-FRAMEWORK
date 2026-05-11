import { useState, useCallback } from 'react'
import { sendMessage, type Message } from '../api/chat'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'

const SESSION_ID = crypto.randomUUID()

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [busy, setBusy] = useState(false)

  const handleSend = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setBusy(true)

    try {
      const answer = await sendMessage(SESSION_ID, text)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `오류가 발생했습니다: ${e instanceof Error ? e.message : String(e)}`,
      }])
    } finally {
      setBusy(false)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          JINION
        </span>
        {busy && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            응답 중...
          </span>
        )}
      </div>

      {/* 메시지 영역 */}
      <MessageList messages={messages} />

      {/* 입력창 */}
      <ChatInput onSend={handleSend} disabled={busy} />
    </div>
  )
}
