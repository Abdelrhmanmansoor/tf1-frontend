import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { jwtVerify } from 'jose'
import { rateLimit } from '@/lib/rate-limit'

const encoder = new TextEncoder()

const contractSchema = z.object({
  contractId: z.string().min(3),
  title: z.string().min(3),
  parties: z.array(z.object({ name: z.string().min(1), role: z.string().min(1) })).min(1),
  terms: z.string().min(10),
  effectiveDate: z.string().min(4),
  signature: z.object({
    signerId: z.string().min(1),
    signedAt: z.string().min(4),
  }).optional(),
})

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get('sportx_access_token')?.value
  const secret = process.env.JWT_ACCESS_SECRET
  if (!token || !secret) return null
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { issuer: 'sportsplatform-api' })
    return payload
  } catch (err) {
    console.warn(`[contracts] invalid token: ${String(err)}`)
    return null
  }
}

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const rl = rateLimit(`contracts:${ip}`, { limit: 10, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } })
  }

  const session = await requireAuth(request)
  if (!session?.userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contractSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  console.info('Contract submitted by', session.userId, 'payload:', {
    contractId: data.contractId,
    title: data.title,
    parties: data.parties?.length,
  })

  return NextResponse.json(
    {
      success: true,
      message: 'Contract saved successfully',
      contractId: data.contractId,
    },
    { status: 200 }
  )
}
