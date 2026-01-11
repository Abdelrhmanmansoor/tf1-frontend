import { describe, expect, it, vi, beforeEach } from 'vitest'
import api from '@/services/api'

// We monkeypatch document.cookie for this test

describe('api CSRF attachment', () => {
  const originalCookie = globalThis.document?.cookie

  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(globalThis, 'document', {
      value: {
        cookie: 'XSRF-TOKEN=test-token; other=1',
      },
      configurable: true,
    })
  })

  it('adds X-CSRF-Token header for unsafe methods when cookie exists', async () => {
    const spy = vi.spyOn(api, 'request')
    // @ts-expect-error private but accessible
    await api.post('/test', { a: 1 })
    const lastCall = spy.mock.calls[0]?.[0] as any
    expect(lastCall?.headers?.['X-CSRF-Token']).toBe('test-token')
    spy.mockRestore()
  })
})
