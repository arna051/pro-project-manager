import { z } from 'zod';

export const ServerSchema = z.object({
    title: z.string()
        .min(1, "Server title is required")
        .max(100, "Server title too long")
        .trim(),
    user: z.string()
        .min(1, "Server user is required")
        .max(100, "Server user too long")
        .trim(),
    host: z.string()
        .min(1, "Host is required")
        .trim(),
    password: z.string()
        .min(1, "Password is required"),
    port: z.string()
        .trim()
        .regex(/^\d+$/, "Port must be numeric")
        .default('22')
});
