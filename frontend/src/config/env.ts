interface EnvConfig {
    apiUrl: string;
    isDevelopment: boolean;
}

export const env: EnvConfig = {
    apiUrl: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_PROD_URL,
    isDevelopment: import.meta.env.NODE_ENV === 'development',
}; 