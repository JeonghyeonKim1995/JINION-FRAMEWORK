import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    ref.current?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  // 자동 높이 조정
  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  return (
    <div style={{
      padding: '12px 16px 16px',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '10px 10px 10px 16px',
      }}>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={onInput}
          onKeyDown={onKey}
          placeholder="메시지를 입력하세요... (Shift+Enter: 줄바꿈)"
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            color: '#e8e8f0',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'inherit',
            maxHeight: 140,
            overflowY: 'auto',
          }}
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
            color: '#fff',
            fontSize: 17,
            cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
            opacity: disabled || !value.trim() ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'opacity .15s',
          }}
        >↑</button>
      </div>
    </div>
  )
}
