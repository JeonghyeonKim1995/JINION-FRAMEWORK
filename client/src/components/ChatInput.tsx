import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { uploadFile, type UploadedFile } from '../api/upload'

interface Props {
  onSend: (text: string, attachments: UploadedFile[]) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSend = !disabled && !uploading && (value.trim().length > 0 || uploads.length > 0)

  const submit = () => {
    if (!canSend) return
    onSend(value.trim(), uploads)
    setValue('')
    setUploads([])
    if (textRef.current) {
      textRef.current.style.height = 'auto'
      textRef.current.focus()
    }
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const onInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    setUploading(true)
    try {
      const results = await Promise.all(files.map(uploadFile))
      setUploads(prev => [...prev, ...results])
    } catch (err) {
      alert(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '10px 10px 10px 12px',
      }}>
        {/* 첨부 파일 미리보기 */}
        {uploads.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {uploads.map((f, i) => (
              <FileChip key={i} file={f} onRemove={() => removeUpload(i)} />
            ))}
          </div>
        )}

        {/* 입력 행 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 첨부 버튼 */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={disabled || uploading}
            title="파일 첨부"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: uploading ? '#6c63ff' : 'rgba(255,255,255,0.4)',
              fontSize: 18,
              cursor: disabled || uploading ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'color .15s',
            }}
          >
            {uploading ? '⏳' : '📎'}
          </button>

          <textarea
            ref={textRef}
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
            disabled={!canSend}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #6c63ff, #3b82f6)',
              color: '#fff',
              fontSize: 17,
              cursor: !canSend ? 'not-allowed' : 'pointer',
              opacity: !canSend ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'opacity .15s',
            }}
          >↑</button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  )
}

function FileChip({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/')
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px 3px 6px',
      borderRadius: 8,
      background: 'rgba(108,99,255,0.2)',
      border: '1px solid rgba(108,99,255,0.4)',
      fontSize: 12,
      color: '#c4c0ff',
      maxWidth: 160,
    }}>
      {isImage ? (
        <img
          src={file.url}
          alt={file.name}
          style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <span style={{ fontSize: 14, flexShrink: 0 }}>📄</span>
      )}
      <span style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{file.name}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          fontSize: 13,
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >✕</button>
    </div>
  )
}
