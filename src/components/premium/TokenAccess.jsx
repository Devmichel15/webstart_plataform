import { useState } from 'react'
import { Key, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { verifyToken } from '../../utils/tokenAccess.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getUserProfile, updateUserProfile } from '../../services/userService.js'

export function TokenAccess({ courseId, onUnlocked }) {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  const handleVerify = async () => {
    const raw = token.trim()
    if (!raw) return

    setStatus('loading')
    setMessage('')

    try {
      const valid = await verifyToken(raw, courseId)
      if (!valid) {
        setStatus('error')
        setMessage('Token inválido. Verifica o código que recebeste.')
        return
      }

      if (user) {
        const profile = await getUserProfile(user.uid)
        const current = profile?.purchasedCourses || []
        await updateUserProfile(user.uid, {
          purchasedCourses: [...new Set([...current, courseId])],
        })
      }

      setStatus('success')
      setMessage('Token validado! Acesso desbloqueado com sucesso.')
      setTimeout(() => onUnlocked?.(), 1500)
    } catch (err) {
      setStatus('error')
      setMessage('Erro ao verificar token. Tenta novamente.')
    }
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-800/40 p-5 dark:border-brand-400/30">
      <div className="mb-3 flex items-center gap-2">
        <Key size={16} className="text-brand-500" />
        <span className="text-sm font-bold text-primary">Já tens um token de acesso?</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={token}
          onChange={(e) => { setToken(e.target.value); setStatus('idle'); setMessage('') }}
          placeholder="Insere o teu token..."
          className="flex-1 rounded-xl border-2 border-strong bg-surface px-4 py-2.5 text-sm font-mono text-primary outline-none transition focus:border-brand-500"
          disabled={status === 'loading'}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text').trim()
            setTimeout(() => {
              setToken(pasted)
              if (pasted) handleVerify()
            }, 50)
          }}
        />
        <button
          onClick={handleVerify}
          disabled={status === 'loading' || !token.trim()}
          className="flex items-center gap-2 rounded-xl border-3 border-brand-800 bg-brand-500 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0_0_#064e3b] transition hover:bg-brand-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 dark:shadow-[2px_2px_0_0_#34d399]"
        >
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
          Validar
        </button>
      </div>

      {message && (
        <div className={`mt-3 flex items-center gap-2 text-sm font-bold ${
          status === 'success' ? 'text-green-600 dark:text-green-400' :
          status === 'error' ? 'text-red-600 dark:text-red-400' :
          'text-secondary'
        }`}>
          {status === 'success' ? <CheckCircle2 size={16} /> :
           status === 'error' ? <XCircle size={16} /> : null}
          {message}
        </div>
      )}
    </div>
  )
}
