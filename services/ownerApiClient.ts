import axios from 'axios';

const ownerClient = axios.create({
    baseURL: '/api/v1/platform-control',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Inject owner secret from sessionStorage
ownerClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        try {
            const secret = sessionStorage.getItem('tf1_owner_key');
            if (secret) {
                config.headers['x-owner-secret'] = secret;
            }
        } catch (e) {
            // fail silently — do not expose secret
        }
    }
    return config;
});

export default ownerClient;
