import { useEffect, useRef } from 'react'
import type { Message } from '../api/chat'
import MessageBubble from './MessageBubble'

interface Props { messages: Message[] }

export default function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 20px 8px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {messages.length === 0 && (
        <div style={{
          margin: 'auto',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 15,
        }}>
          무엇이든 물어보세요
        </div>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={i} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
