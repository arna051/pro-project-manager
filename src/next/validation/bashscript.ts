import { z } from 'zod';

export const BashScriptSchema = z.object({
    title: z.string()
        .min(1, "Script title is required")
        .max(100, "Script title too long")
        .trim(),
    script: z.string()
        .min(1, "Script body is required"),
    description: z.string()
        .trim()
        .optional()
        .nullable()
        .transform(val => val === null ? undefined : val)
});
