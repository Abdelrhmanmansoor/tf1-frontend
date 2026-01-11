import { describe, expect, it, beforeEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  it('allows requests under limit', () => {
    const key = `user:${Date.now()}:under`
    const res1 = rateLimit(key, { limit: 2, windowMs: 1000 })
    const res2 = rateLimit(key, { limit: 2, windowMs: 1000 })
    expect(res1.allowed).toBe(true)
    expect(res2.allowed).toBe(true)
  })

  it('blocks when over limit and returns retryAfter', () => {
    const key = `user:${Date.now()}:over`
    rateLimit(key, { limit: 1, windowMs: 50 }) // first allowed
    const blocked = rateLimit(key, { limit: 1, windowMs: 50 })
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })
})
