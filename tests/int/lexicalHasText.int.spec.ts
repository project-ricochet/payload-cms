import { describe, expect, it } from 'vitest'

import { lexicalHasText } from '../../src/utilities/lexicalHasText'

describe('lexicalHasText', () => {
  it('returns false for empty default Lexical root (one empty paragraph)', () => {
    const empty = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '',
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    }
    expect(lexicalHasText(empty)).toBe(false)
  })

  it('returns true when a paragraph has non-empty text', () => {
    const value = {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
    }
    expect(lexicalHasText(value)).toBe(true)
  })
})
