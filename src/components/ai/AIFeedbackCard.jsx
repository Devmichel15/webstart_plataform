import { AlertTriangle, CheckCircle, Lightbulb, Target, TrendingUp, X } from 'lucide-react'

function ScoreRing({ score }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={68} height={68} className="rotate-[-90deg]">
        <circle cx={34} cy={34} r={radius} fill="none" stroke="#1e293b" strokeWidth={5} />
        <circle
          cx={34} cy={34} r={radius}
          fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <text
          x={34} y={34}
          textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={16} fontWeight={800}
          className="rotate-90"
          style={{ fontFamily: "'Cascadia Code', 'Fira Code', monospace" }}
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Score</span>
    </div>
  )
}

export function AIFeedbackCard({ feedback, score, mistakes, improvements, explanation, onClose }) {
  if (!feedback) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border-3 border-brand-800 bg-surface shadow-[4px_4px_0_0_#064e3b] dark:border-brand-400 dark:shadow-[4px_4px_0_0_#34d399]">
      {onClose && (
        <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200">
          <X size={18} />
        </button>
      )}

      <div className="flex items-start gap-5 p-5">
        <ScoreRing score={score} />

        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-balance">{feedback}</p>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="border-t-2 border-red-900/30 px-5 py-4 dark:border-red-400/20">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
            <AlertTriangle size={16} />
            Erros encontrados
          </div>
          <ul className="space-y-1.5">
            {mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <span className="mt-0.5 shrink-0 text-red-500">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="border-t-2 border-brand-900/30 px-5 py-4 dark:border-brand-400/20">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400">
            <TrendingUp size={16} />
            Sugestões de melhoria
          </div>
          <ul className="space-y-1.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="mt-0.5 shrink-0 text-brand-500">✦</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {explanation && (
        <div className="border-t-2 border-amber-900/30 px-5 py-4 dark:border-amber-400/20">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            <Lightbulb size={16} />
            Explicação
          </div>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{explanation}</p>
        </div>
      )}

      <div className="flex items-center gap-2 border-t-2 border-zinc-800/30 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-700/30">
        <CheckCircle size={12} />
        WebStart AI Tutor
      </div>
    </div>
  )
}
