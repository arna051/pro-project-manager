import { z } from "zod";

export const EvidenceZodSchema = z.object({
    contractorsIds: z.array(z.string()),

    title: z.string().min(1, { message: "Title is required" }).trim(),

    content: z.string().trim(),

    attachmentsIds: z.array(z.string()).optional()
});
