import { z } from 'zod';

export const DeployScriptSchema = z.object({
    name: z.string()
        .min(1, "Deploy script name is required")
        .max(100, "Deploy script name too long")
        .trim(),
    serverIds: z.array(z.string()
        .min(1, "Server id cannot be empty")
        .trim())
        .max(10, "Too many servers (max 10)")
        .default([]),
    script: z.string()
        .min(1, "Deploy script content is required")
});

export const RepoSchema = z.object({
    projectId: z.string()
        .min(1, "Project id is required")
        .trim(),
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title too long (max 100 characters)")
        .trim(),
    path: z.string()
        .min(1, "Repository path is required")
        .trim(),
    devCommand: z.string()
        .trim()
        .max(200, "Dev command too long")
        .default(''),
    buildCommand: z.string()
        .trim()
        .max(200, "build command too long")
        .default(''),
    deployScript: z.array(DeployScriptSchema).optional(),
    icon: z.array(z.string()
        .trim())
        .default([]),
    ignore: z.string().optional()
});
