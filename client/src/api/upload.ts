export interface UploadedFile {
  url: string
  key: string
  name: string
  size: number
  type: string
}

// TODO: 백엔드 MinIO 업로드 엔드포인트 확정 후 수정
export async function uploadFile(file: File): Promise<UploadedFile> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error(`업로드 실패 (${res.status})`)
  return res.json()
}
