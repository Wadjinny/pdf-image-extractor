export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    ENDPOINTS: {
        UPLOAD: '/extract-images',
        DOWNLOAD: '/pdf',
    },
} as const;

export const FILE_CONFIG = {
    ALLOWED_TYPES: ['application/pdf'],
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

export const UI_CONFIG = {
    TOAST_POSITION: 'top-center' as const,
    MAX_FILE_NAME_LENGTH: 50,
} as const; 