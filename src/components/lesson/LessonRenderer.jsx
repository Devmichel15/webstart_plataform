import { SectionHeader } from './sections/SectionHeader.jsx'
import { ConceptContent } from './sections/ConceptContent.jsx'
import { HowItWorksSection } from './sections/HowItWorksSection.jsx'
import { ListSection } from './sections/ListSection.jsx'
import { ChallengeBlock } from './sections/ChallengeBlock.jsx'
import { QuizBlock } from './sections/QuizBlock.jsx'
import { Card } from '../ui/Card.jsx'
import { ExerciseBlock } from './ExerciseBlock.jsx'
import { CodeLab } from '../lab/CodeLab.jsx'

const sections = [
  { key: 'introduction', title: 'Introdução', component: 'concept' },
  { key: 'history', title: 'História', component: 'concept' },
  { key: 'concept', title: 'Conceito', component: 'concept' },
  { key: 'howItWorks', title: 'Como Funciona', component: 'howItWorks' },
  { key: 'objectives', title: 'Objetivos', component: 'list', listType: 'objectives' },
  { key: 'prerequisites', title: 'Pré-requisitos', component: 'list', listType: 'prerequisites' },
  { key: 'realWorldApplications', title: 'Aplicações Reais', component: 'list', listType: 'realWorldApplications' },
  { key: 'bestPractices', title: 'Boas Práticas', component: 'list', listType: 'bestPractices' },
  { key: 'commonMistakes', title: 'Erros Comuns', component: 'list', listType: 'commonMistakes' },
  { key: 'curiosities', title: 'Curiosidades', component: 'list', listType: 'curiosities' },
  { key: 'deepDive', title: 'Aprofundamento', component: 'concept' },
]

export function LessonRenderer({ lesson }) {
  if (!lesson) return null

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const value = lesson[section.key]
        if (!value || (Array.isArray(value) && !value.length)) return null

        return (
          <section key={section.key} className="space-y-3">
            <SectionHeader type={section.key} title={section.title} />
            {section.component === 'concept' && <ConceptContent content={value} />}
            {section.component === 'howItWorks' && <HowItWorksSection content={value} />}
            {section.component === 'list' && <ListSection type={section.listType} items={value} />}
          </section>
        )
      })}

      {lesson.example && (
        <section className="space-y-4">
          <SectionHeader type="example" title="Exemplo" />
          <CodeLab
            initialHtml={lesson.example.html || ''}
            initialCss={lesson.example.css || ''}
            compact
          />
        </section>
      )}

      {lesson.playground && (
        <section className="space-y-4">
          <SectionHeader type="playground" title="Playground" />
          <CodeLab
            initialHtml={lesson.playground.html || ''}
            initialCss={lesson.playground.css || ''}
            compact
          />
        </section>
      )}

      {lesson.challenge && (
        <section className="space-y-4">
          <SectionHeader type="challenge" title="Desafio" />
          <ChallengeBlock challenge={lesson.challenge} />
        </section>
      )}

      {lesson.exercise && (
        <section className="space-y-4">
          <SectionHeader type="exercise" title="Exercício" />
          <ExerciseBlock exercise={lesson.exercise} />
        </section>
      )}

      {lesson.quiz && (
        <section className="space-y-4">
          <SectionHeader type="quiz" title="Quiz da Aula" />
          <QuizBlock quiz={lesson.quiz} compact />
        </section>
      )}

      {lesson.videoRecommendations && lesson.videoRecommendations.length > 0 && (
        <section className="space-y-4">
          <SectionHeader type="video" title="Vídeos Recomendados" />
          <Card>
            <ul className="space-y-3">
              {lesson.videoRecommendations.map((video, i) => (
                <li key={i}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {lesson.finalTip && (
        <section className="space-y-4">
          <SectionHeader type="tip" title="Dica Final" />
          <Card>
            <p className="text-sm leading-relaxed text-secondary">{lesson.finalTip}</p>
          </Card>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeader type="objectives" title="Resumo" />
        <Card>
          {lesson.summary && lesson.summary.length > 0 ? (
            <ul className="space-y-2">
              {lesson.summary.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary">Nenhum resumo disponível.</p>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeader type="objectives" title="Checklist" />
        <Card>
          {lesson.checklist && lesson.checklist.length > 0 ? (
            <ul className="space-y-3">
              {lesson.checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <input type="checkbox" className="h-5 w-5 accent-brand-500" />
                  <span className="text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary">Nenhum checklist disponível.</p>
          )}
        </Card>
      </section>
    </div>
  )
}
