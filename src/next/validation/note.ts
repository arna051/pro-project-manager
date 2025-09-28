import { z } from 'zod';

export const NoteSchema = z.object({
    title: z.string()
        .min(1, "Note title is required")
        .max(150, "Note title too long")
        .trim(),
    content: z.array(z.object({
        title: z.string(),
        content: z.string()
    }))
});
