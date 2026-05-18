import { describe, expect, it } from 'vitest'

import { slugify } from '../../src/utilities/slugify'

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips diacritics', () => {
    expect(slugify('Café résumé')).toBe('cafe-resume')
  })

  it('collapses punctuation and trims hyphens', () => {
    expect(slugify('  Foo -- Bar!!  ')).toBe('foo-bar')
  })
})
