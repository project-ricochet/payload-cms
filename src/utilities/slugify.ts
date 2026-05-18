/**
 * ASCII-ish slug for URLs: lowercase, hyphen-separated, no leading/trailing hyphens.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
