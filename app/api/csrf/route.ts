import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const token = crypto.randomUUID()
  const isProd = process.env.NODE_ENV === 'production'
  const res = NextResponse.json({ csrfToken: token })
  res.cookies.set('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  })
  return res
}
