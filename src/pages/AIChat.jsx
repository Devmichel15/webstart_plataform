import { Sparkles } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { AIChat } from '../components/ai/AIChat'

export default function AIChatPage() {
  return (
    <div>
      <Header
        title="Tutor IA"
        subtitle="Pergunta, corrige código, explica conceitos — o teu tutor pessoal de HTML"
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border-3 border-brand-800 bg-gradient-to-br from-brand-500/10 to-brand-700/5 p-5 dark:border-brand-400">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center ">
            <img src="/logo.svg" alt="" />
          </div>
          <div>
            <p className="text-sm font-black">Bem-vindo ao Tutor IA da WebStart</p>
            <p className="text-xs text-secondary">
              Podes fazer perguntas, pedir correção de código, ou explicações sobre HTML/CSS/JS.
              A IA responde como um mentor experiente.
            </p>
          </div>
        </div>

        <AIChat />
      </div>
    </div>
  )
}
