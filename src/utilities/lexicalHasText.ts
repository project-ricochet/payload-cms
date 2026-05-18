/**
 * Mirrors Payload Lexical's internal hasText check (@payloadcms/richtext-lexical):
 * required richText fails if the only "content" is an empty paragraph.
 */
export function lexicalHasText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  const hasChildren = !!root?.children?.length

  let hasOnlyEmptyParagraph = false
  const children = root?.children
  if (children?.length === 1) {
    const first = children[0] as {
      type?: string
      children?: { type?: string; text?: string }[]
    }
    if (first?.type === 'paragraph') {
      if (!first.children || first.children.length === 0) {
        hasOnlyEmptyParagraph = true
      } else if (first.children.length === 1) {
        const c = first.children[0]
        if (c?.type === 'text' && !(c.text?.length ?? 0)) {
          hasOnlyEmptyParagraph = true
        }
      }
    }
  }

  return Boolean(hasChildren && !hasOnlyEmptyParagraph)
}
