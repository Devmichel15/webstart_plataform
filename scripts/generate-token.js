import crypto from 'crypto'

const customToken = process.argv[2]
const token = customToken || crypto.randomUUID()
const hash = crypto.createHash('sha256').update(token).digest('hex')

console.log('=== TOKEN DE ACESSO ===')
console.log(`Token: ${token}`)
console.log(`Hash:  ${hash}`)
console.log('')
console.log('Adiciona ao .env o hash correspondente à trilha:')
console.log(`VITE_ACCESS_TOKEN_HASH_HTML=${hash}`)
console.log('')
if (!customToken) {
  console.log('Envia o token para o aluno.')
} else {
  console.log('Hash do teu token personalizado atualizado no .env!')
}
