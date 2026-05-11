import type { Message } from '../api/chat'

interface Props { msg: Message }

export default function MessageBubble({ msg }: Props) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      <div style={{
        maxWidth: '72%',
        padding: '10px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #6c63ff, #3b82f6)'
          : 'rgba(255,255,255,0.07)',
        color: '#e8e8f0',
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
      }}>
        {msg.content}
      </div>
    </div>
  )
}
