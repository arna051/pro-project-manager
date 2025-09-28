import { z } from 'zod';

const PhoneSchema = z.string()
    .min(3, "Phone number too short")
    .max(20, "Phone number too long")
    .trim();

export const ContractorSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name too long (max 100 characters)")
        .trim(),
    avatar: z.string()
        .optional()
        .nullable()
        .transform(val => val === null ? undefined : val),
    phones: z.array(PhoneSchema)
        .max(10, "Too many phone numbers (max 10)")
        .default([]),
    address: z.string()
        .max(200, "Address too long (max 200 characters)")
        .trim()
        .optional()
        .nullable()
        .transform(val => val === null ? undefined : val),
    description: z.string()
        .max(500, "Description too long (max 500 characters)")
        .trim()
        .optional()
        .nullable()
        .transform(val => val === null ? undefined : val)
});
