import { z } from 'zod';

// Chỉ định nghĩa các biến DÙNG CHUNG giữa tất cả apps
const envSchema = z.object({
    VITE_BACKEND_ENDPOINT: z.string(),
    VITE_BACKEND_API_ENDPOINT: z.string()
});

export default envSchema;