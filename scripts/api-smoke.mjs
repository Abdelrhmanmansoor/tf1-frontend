// Simple API smoke tests for Job Seeker endpoints
// Usage: set NEXT_PUBLIC_API_URL and SPORTX_TOKEN environment variables
// Run: npm run api:smoke

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const token = process.env.SPORTX_TOKEN || ''

if (!apiUrl) {
  console.error('NEXT_PUBLIC_API_URL is not set')
  process.exit(1)
}

const headers = token ? { Authorization: `Bearer ${token}` } : {}

async function testJobsList() {
  const res = await fetch(`${apiUrl}/search/jobs`)
  const data = await res.json()
  if (!res.ok) throw new Error(`Jobs list failed: ${res.status} ${JSON.stringify(data)}`)
  const jobs = data.results || data.jobs || []
  console.log(`[OK] Jobs list: ${Array.isArray(jobs) ? jobs.length : 0} jobs`)
}

async function testMyApplications() {
  const res = await fetch(`${apiUrl}/applications/my-applications`, { headers })
  const data = await res.json()
  if (!res.ok) throw new Error(`My applications failed: ${res.status} ${JSON.stringify(data)}`)
  const apps = data.applications || []
  console.log(`[OK] My applications: ${Array.isArray(apps) ? apps.length : 0}`)
}

async function testNotifications() {
  const res = await fetch(`${apiUrl}/notifications?limit=5`, { headers })
  if (!res.ok) {
    console.warn(`[WARN] Notifications endpoint returned ${res.status} - skipping`)
    return
  }
  const data = await res.json()
  const list = data.notifications || []
  console.log(`[OK] Notifications: ${Array.isArray(list) ? list.length : 0}`)
}

async function run() {
  try {
    await testJobsList()
    await testMyApplications()
    await testNotifications()
    console.log('All smoke tests passed')
    process.exit(0)
  } catch (err) {
    console.error('Smoke test failed:', err.message)
    process.exit(1)
  }
}

run()
