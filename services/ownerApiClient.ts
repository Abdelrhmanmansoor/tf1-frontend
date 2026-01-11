import axios from 'axios'

let ownerSecret: string | null = null

export function setOwnerSecret(secret: string | null) {
    ownerSecret = secret
}

const ownerClient = axios.create({
    baseURL: '/api/v1/platform-control',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Inject owner secret from in-memory variable only (no persistent storage)
ownerClient.interceptors.request.use((config) => {
    if (ownerSecret) {
        config.headers['x-owner-secret'] = ownerSecret
    }
    return config
})

export default ownerClient
