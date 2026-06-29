const SECRET = import.meta.env.VITE_ACCESS_TOKEN_HASH_HTML

async function hmacSign(data) {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(SECRET)
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hex
}

export async function signToken(rawToken) {
  const sig = await hmacSign(rawToken)
  return `${rawToken}-${sig.slice(0, 8).toUpperCase()}`
}

export async function verifyToken(fullToken, courseId) {
  if (!fullToken || !courseId) return false

  const parts = fullToken.split('-')
  if (parts.length < 2) return false

  const sigPart = parts.pop()
  const rawToken = parts.join('-')

  const computedSig = await hmacSign(rawToken)
  return sigPart === computedSig.slice(0, 8).toUpperCase()
}
