function isWhitespace(ch) {
  return ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t'
}

function skipString(css, i) {
  const quote = css[i]
  i++
  while (i < css.length) {
    if (css[i] === '\\') { i += 2; continue }
    if (css[i] === quote) { i++; break }
    i++
  }
  return i
}

function skipParens(css, i) {
  i++ // skip (
  let depth = 1
  while (i < css.length && depth > 0) {
    if (css[i] === '(') depth++
    else if (css[i] === ')') depth--
    else if (css[i] === '"' || css[i] === "'") i = skipString(css, i)
    if (depth > 0) i++
  }
  if (i < css.length) i++ // skip )
  return i
}

function parseRules(css) {
  const rules = []
  let i = 0

  const readSelector = () => {
    const start = i
    while (i < css.length) {
      const ch = css[i]
      if (ch === '{' || ch === ';' || ch === '}') break
      if (ch === '(') { i = skipParens(css, i); continue }
      if (ch === '"' || ch === "'") { i = skipString(css, i); continue }
      i++
    }
    return css.slice(start, i)
  }

  while (i < css.length) {
    while (i < css.length && isWhitespace(css[i])) i++
    if (i >= css.length) break

    if (css[i] === '}') { i++; continue }

    const selector = readSelector()
    if (i >= css.length) break

    const trimmed = selector.trim()
    if (!trimmed) { i++; continue }

    if (css[i] === ';') {
      rules.push({ type: 'statement', value: trimmed })
      i++
      continue
    }

    if (css[i] === '{') {
      i++ // skip {
      let bodyStart = i
      let depth = 1
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth++
        else if (css[i] === '}') depth--
        if (depth > 0) i++
      }
      const body = css.slice(bodyStart, i)
      i++ // skip }

      rules.push({ type: 'rule', selector: trimmed, body })
    }
  }

  return rules
}

function splitDeclarations(body) {
  const decls = []
  let current = ''

  for (let i = 0; i < body.length; i++) {
    const ch = body[i]

    if (ch === '"' || ch === "'") {
      const start = i
      i = skipString(body, i)
      current += body.slice(start, i)
      i-- // for loop will increment
      continue
    }

    if (ch === '(') {
      const start = i
      i = skipParens(body, i)
      current += body.slice(start, i)
      i-- // for loop will increment
      continue
    }

    if (ch === ';') {
      const trimmed = current.trim()
      if (trimmed) decls.push(trimmed)
      current = ''
      continue
    }

    current += ch
  }

  const trimmed = current.trim()
  if (trimmed) decls.push(trimmed)

  return decls
}

function stringifyRules(rules, indent) {
  const lines = []

  for (const rule of rules) {
    if (rule.type === 'statement') {
      lines.push('  '.repeat(indent) + rule.value + ';')
      continue
    }

    const isAtRule = rule.selector.startsWith('@')
    const isKeyframe = isAtRule && rule.selector.includes('keyframes')
    const isNestedAt =
      isAtRule &&
      !isKeyframe &&
      !rule.selector.startsWith('@import') &&
      !rule.selector.startsWith('@charset') &&
      !rule.selector.startsWith('@namespace') &&
      !rule.selector.startsWith('@font-face') &&
      !rule.selector.startsWith('@layer')

    lines.push('  '.repeat(indent) + rule.selector + ' {')

    if (isKeyframe || isNestedAt) {
      const inner = parseRules(rule.body)
      lines.push(...stringifyRules(inner, indent + 2))
    } else {
      const decls = splitDeclarations(rule.body)
      for (const decl of decls) {
        lines.push('  '.repeat(indent + 2) + decl + ';')
      }
    }

    lines.push('  '.repeat(indent) + '}')
    if (indent === 0) lines.push('')
  }

  return lines
}

export function formatCSS(css) {
  if (!css || !css.trim()) return css || ''
  const rules = parseRules(css)
  if (!rules.length) return css.trim()
  const lines = stringifyRules(rules, 0)
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  return lines.join('\n')
}

const VOID_ELEMENTS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i

function countHTMLTags(line) {
  let openings = 0
  let closings = 0
  let selfClosings = 0

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g
  let match

  while ((match = tagRegex.exec(line)) !== null) {
    const tag = match[0]
    const tagName = match[1]

    if (tag.startsWith('</')) {
      closings++
    } else if (tag.endsWith('/>')) {
      selfClosings++
    } else if (VOID_ELEMENTS.test(tagName)) {
      selfClosings++
    } else {
      openings++
    }
  }

  return { openings, closings, selfClosings }
}

export function formatHTML(html) {
  if (!html || !html.trim()) return html || ''

  html = html.trim()

  const normalized = html.replace(/>\s*</g, '>\n<')

  const rawLines = normalized.split('\n').map(l => l.trim()).filter(Boolean)
  if (rawLines.length <= 1) return html

  const result = []
  let indent = 0

  for (const line of rawLines) {
    const { openings, closings, selfClosings } = countHTMLTags(line)
    const delta = openings - closings - selfClosings

    if (delta < 0) {
      indent += delta
      if (indent < 0) indent = 0
      result.push('  '.repeat(indent) + line)
    } else {
      result.push('  '.repeat(indent) + line)
      indent += delta
    }
  }

  return result.join('\n')
}
