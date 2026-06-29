import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ClipboardCopy, ClipboardCheck, Copy, Mail, RefreshCw, Trash2, UserPlus } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useToast } from '../../contexts/ToastContext.jsx'
import { signToken } from '../../utils/tokenAccess.js'

const STORAGE_KEY = 'webstart_payments'
const COURSE = 'html'

function loadPayments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePayments(payments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
}

function generateToken() {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `WS-HTML-${rand()}-${rand()}`
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function isToday(iso) {
  return iso?.slice(0, 10) === getTodayKey()
}

export default function PaymentVerifier() {
  const { showSuccess, showError } = useToast()
  const [payments, setPayments] = useState(loadPayments)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [generatedToken, setGeneratedToken] = useState(null)
  const [copied, setCopied] = useState(false)

  const persist = useCallback((updated) => {
    setPayments(updated)
    savePayments(updated)
  }, [])

  const stats = useMemo(() => {
    const total = payments.length
    const todayCount = payments.filter((p) => isToday(p.createdAt)).length
    const lastTen = [...payments].reverse().slice(0, 10)
    return { total, todayCount, lastTen }
  }, [payments])

  const handleGenerate = useCallback(async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      showError('Email é obrigatório.')
      return
    }

    const rawToken = generateToken()
    const token = await signToken(rawToken)
    const entry = {
      email: trimmedEmail,
      name: name.trim() || trimmedEmail.split('@')[0],
      course: COURSE,
      token,
      createdAt: new Date().toISOString(),
    }

    persist([entry, ...payments])
    setGeneratedToken(token)
    setEmail('')
    setName('')
    setCopied(false)
    showSuccess('Acesso gerado com sucesso!')
  }, [email, name, payments, persist, showError, showSuccess])

  const handleCopyToken = useCallback(() => {
    if (!generatedToken) return
    navigator.clipboard.writeText(generatedToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedToken])

  const handleCopyEmailBody = useCallback((entry) => {
    const assunto = 'Acesso à Trilha HTML - WebStart'
    const corpo = `Olá ${entry.name},

O teu pagamento foi confirmado.

Código de acesso:
${entry.token}

Passos:
1. Aceder à WebStart
2. Abrir trilha HTML
3. Clicar em "Já paguei"
4. Inserir o código`

    navigator.clipboard.writeText(`Assunto: ${assunto}\n\n${corpo}`)
    showSuccess('Email copiado para a área de transferência!')
  }, [showSuccess])

  const handleClearHistory = useCallback(() => {
    persist([])
    setGeneratedToken(null)
    showSuccess('Histórico limpo!')
  }, [persist, showSuccess])

  return (
    <div>
      <Header title="Pagamentos" subtitle="Verificador manual de pagamentos — Trilha HTML" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card hover className="h-full">
            <p className="mb-1 text-sm font-semibold text-secondary">Total Aprovados</p>
            <p className="text-3xl font-black">{stats.total}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card hover className="h-full">
            <p className="mb-1 text-sm font-semibold text-secondary">Tokens Gerados</p>
            <p className="text-3xl font-black">{stats.total}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card hover className="h-full">
            <p className="mb-1 text-sm font-semibold text-secondary">Hoje</p>
            <p className="text-3xl font-black">{stats.todayCount}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card hover className="h-full">
            <p className="mb-1 text-sm font-semibold text-secondary">Curso</p>
            <p className="text-3xl font-black">HTML</p>
          </Card>
        </motion.div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="text-brand-500" size={20} />
            <h2 className="text-lg font-black">Novo Acesso</h2>
          </div>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-bold text-secondary">
                Email do aluno <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@exemplo.com"
                className="w-full rounded-lg border-3 border-strong bg-surface px-3 py-2 text-sm font-semibold text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-bold text-secondary">
                Nome do aluno <span className="text-muted">(opcional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João Silva"
                className="w-full rounded-lg border-3 border-strong bg-surface px-3 py-2 text-sm font-semibold text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-secondary">Curso</label>
              <div className="rounded-lg border-3 border-strong bg-surface-hover px-3 py-2 text-sm font-bold text-primary">
                Trilha HTML
              </div>
            </div>
            <Button type="submit" className="w-full">
              <RefreshCw size={16} />
              Gerar Acesso
            </Button>
          </form>
        </Card>

        {generatedToken && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-brand-500" size={20} />
                <h2 className="text-lg font-black">Token Gerado</h2>
              </div>

              <div className="mb-4">
                <p className="mb-1 text-sm font-semibold text-secondary">Código de acesso</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg border-3 border-strong bg-brand-50 px-4 py-3 text-lg font-black text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                    {generatedToken}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border-3 border-strong bg-surface transition hover:bg-surface-hover"
                  >
                    {copied ? <ClipboardCheck size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <p className="mb-1 text-sm font-semibold text-secondary">Email para envio</p>
                <div className="rounded-lg border-3 border-strong bg-surface-hover p-4 text-sm">
                  <p className="mb-1 font-bold">Assunto: Acesso à Trilha HTML - WebStart</p>
                  <hr className="my-2 border-border" />
                  <p>Olá {name || email.split('@')[0]},</p>
                  <p className="my-2">O teu pagamento foi confirmado.</p>
                  <p className="font-bold">Código de acesso:</p>
                  <code className="my-1 block rounded bg-brand-100 px-2 py-1 font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    {generatedToken}
                  </code>
                  <p className="mt-2 font-bold">Passos:</p>
                  <ol className="ml-4 list-decimal space-y-0.5">
                    <li>Aceder à WebStart</li>
                    <li>Abrir trilha HTML</li>
                    <li>Clicar em &ldquo;Já paguei&rdquo;</li>
                    <li>Inserir o código</li>
                  </ol>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const assunto = 'Acesso à Trilha HTML - WebStart'
                  const nome = name || email.split('@')[0]
                  const corpo = `Olá ${nome},\n\nO teu pagamento foi confirmado.\n\nCódigo de acesso:\n${generatedToken}\n\nPassos:\n1. Aceder à WebStart\n2. Abrir trilha HTML\n3. Clicar em "Já paguei"\n4. Inserir o código`
                  navigator.clipboard.writeText(`Assunto: ${assunto}\n\n${corpo}`)
                  showSuccess('Email copiado!')
                }}
              >
                <Mail size={16} />
                Copiar Email
              </Button>
            </Card>
          </motion.div>
        )}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCopy className="text-brand-500" size={20} />
            <h2 className="text-lg font-black">Últimos Alunos</h2>
            <Badge>{stats.total} total</Badge>
          </div>
          {payments.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearHistory} className="text-red-500 hover:text-red-600">
              <Trash2 size={14} />
              Limpar histórico
            </Button>
          )}
        </div>

        {payments.length === 0 ? (
          <p className="py-8 text-center text-sm font-semibold text-muted">
            Nenhum pagamento registado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-3 border-strong text-xs font-bold uppercase tracking-wide text-secondary">
                  <th className="py-2 pr-4">Aluno</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 pr-4">Curso</th>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {stats.lastTen.map((entry, idx) => (
                  <tr key={`${entry.token}-${idx}`} className="border-b border-border">
                    <td className="py-2 pr-4 font-bold">{entry.name}</td>
                    <td className="py-2 pr-4 text-secondary">{entry.email}</td>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-bold">
                        {entry.token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 uppercase text-secondary">HTML</td>
                    <td className="py-2 pr-4 text-xs text-secondary">
                      {new Date(entry.createdAt).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => handleCopyEmailBody(entry)}
                        className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                      >
                        <Mail size={14} />
                        Copiar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
