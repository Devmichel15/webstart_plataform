import { motion } from 'framer-motion'

export function ConceptContent({ content }) {
  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="prose prose-brand max-w-none text-reading"
    >
      <p className="leading-relaxed text-lg">{content}</p>
    </motion.div>
  )
}
