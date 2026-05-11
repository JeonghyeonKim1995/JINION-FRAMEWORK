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
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
      }}>
        {/* 첨부 파일 */}
        {msg.attachments?.length ? (
          <div style={{ marginBottom: msg.content ? 8 : 0 }}>
            {msg.attachments.map((a, i) =>
              a.type.startsWith('image/') ? (
                <img
                  key={i}
                  src={a.url}
                  alt={a.name}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: 240,
                    borderRadius: 8,
                    marginBottom: 4,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.2)',
                    color: '#c4c0ff',
                    textDecoration: 'none',
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >
                  <span>📄</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.name}
                  </span>
                </a>
              )
            )}
          </div>
        ) : null}

        {/* 텍스트 */}
        {msg.content && (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {msg.content}
          </span>
        )}
      </div>
    </div>
  )
}
