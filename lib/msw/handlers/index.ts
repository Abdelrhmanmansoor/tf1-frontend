import { http, HttpResponse } from 'msw'

export const handlers = [
  // Demo ping handler
  http.get('/api/ping', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]