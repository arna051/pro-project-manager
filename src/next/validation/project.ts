import { z } from 'zod';

// Enhanced Todo schema
export const TodoSchema = z.object({
    task: z.string()
        .min(1, "Task cannot be empty")
        .trim(),
    date: z.date({
        error: "Date is required",
    }),
    priority: z.number()
        .int("Priority must be an integer")
        .min(1, "Priority must be at least 1")
        .max(10, "Priority cannot exceed 10")
        .default(5)
});

// Enhanced Project schema
export const ProjectSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title too long (max 100 characters)")
        .trim(),
    image: z.string()
        .min(1, "Project image is required")
        .trim(),
    priority: z.number()
        .min(0, "Priority cannot be below 0")
        .max(5, "Priority cannot exceed 5")
        .default(0),
    todos: z.array(TodoSchema)
        .max(50, "Too many todos (max 50)")
        .default([]),
    contractorIds: z.array(z.string())
        .max(20, "Too many contractors (max 20)")
        .default([]),
    serversIds: z.array(z.string())
        .max(10, "Too many servers (max 10)")
        .default([]),
    description: z.string()
        .max(500, "Description too long (max 500 characters)")
        .trim()
        .optional()
        .nullable()
        .transform(val => val === null ? undefined : val),
    categoryIds: z.array(z.string())
        .max(10, "Too many categories (max 10)")
        .default([]),
    repositoryIds: z.array(z.string())
        .max(10, "Too many repositories (max 10)")
        .default([])
}).refine(
    (data) => data.todos.every(todo => todo.date >= new Date()),
    {
        message: "Todo dates cannot be in the past",
        path: ["todos"]
    }
);
