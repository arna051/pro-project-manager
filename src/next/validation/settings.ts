import { z } from 'zod';

export const SettingSchema = z.object({
    key: z.string()
        .min(1, "Setting key is required")
        .max(100, "Setting key too long")
        .trim(),
    value: z.string()
        .min(1, "Setting value is required")
        .trim()
});
