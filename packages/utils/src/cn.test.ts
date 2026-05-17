import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('returns a single class string', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('merges conflicting Tailwind classes in favour of the last value', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('ignores falsy conditional classes', () => {
    expect(cn('base', false && 'hidden', null, undefined, 'visible')).toBe('base visible')
  })

  it('handles undefined and empty strings', () => {
    expect(cn(undefined, '', 'foo')).toBe('foo')
  })
})
