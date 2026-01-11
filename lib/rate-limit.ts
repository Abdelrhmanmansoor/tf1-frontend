type BucketKey = string

const buckets = new Map<BucketKey, { count: number; resetAt: number }>()

interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function rateLimit(key: string, options: RateLimitOptions): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true, remaining: options.limit - 1, retryAfter: 0 }
  }

  if (bucket.count < options.limit) {
    bucket.count += 1
    return { allowed: true, remaining: options.limit - bucket.count, retryAfter: 0 }
  }

  const retryAfter = Math.max(0, bucket.resetAt - now)
  return { allowed: false, remaining: 0, retryAfter }
}
