import { cookies, headers } from 'next/headers'
import { jwtVerify, JWTPayload } from 'jose'

const encoder = new TextEncoder()

async function verifyToken(token: string, secretEnv: string, issuer = 'sportsplatform-api') {
  const secret = process.env[secretEnv]
  if (!secret) {
    console.warn(`[server-session] Missing secret ${secretEnv}`)
    return null
  }
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { issuer })
    return payload
  } catch (err) {
    console.warn(`[server-session] jwtVerify failed: ${String(err)}`)
    return null
  }
}

export async function getSessionFromCookie(options?: {
  cookieName?: string
  secretEnv?: string
  issuer?: string
}): Promise<JWTPayload | null> {
  const cookieName = options?.cookieName || 'sportx_access_token'
  const secretEnv = options?.secretEnv || 'JWT_ACCESS_SECRET'
  const issuer = options?.issuer || 'sportsplatform-api'
  const token = cookies().get(cookieName)?.value
  if (!token) return null
  return verifyToken(token, secretEnv, issuer)
}

export function getCurrentPathname(): string {
  const h = headers()
  return h.get('x-invoke-path') || h.get('x-pathname') || h.get('referer')?.split('//').pop()?.split('?')[0] || '/'
}
