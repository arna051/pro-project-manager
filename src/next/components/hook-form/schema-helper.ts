import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

// const isSsr = typeof window === 'undefined';

type InputProps = {
  message?: {
    required_error?: string;
    invalid_type_error?: string;
  };
  minFiles?: number;
  isValidPhoneNumber?: (text: string) => boolean;
};

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === null
   */
  phoneNumber: (props?: InputProps) =>
    zod
      .string()
      .min(1, { message: props?.message?.required_error ?? 'Phone number is required!' })
      .refine((data) => props?.isValidPhoneNumber?.(data), {
        message: props?.message?.invalid_type_error ?? 'Invalid phone number!',
      }),
  /**
   * editor
   * defaultValue === '' | <p></p>
   */
  editor: (props?: InputProps) =>
    zod.string().min(8, { message: props?.message?.required_error ?? 'Editor is required!' }),
  /**
   * object
   * defaultValue === null
   */
  objectOrNull: <T>(props?: InputProps) =>
    zod
      .custom<T>()
      .refine((data) => data !== null, {
        message: props?.message?.required_error ?? 'Field is required!',
      })
      .refine((data) => data !== '', {
        message: props?.message?.required_error ?? 'Field is required!',
      }),
  /**
   * boolean
   * defaultValue === false
   */
  boolean: (props?: InputProps) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? 'Switch is required!',
    }),
  /**
   * file
   * defaultValue === '' || null
   */
  file: (props?: InputProps) =>
    zod.custom<File | string | null>().transform((data, ctx) => {
      const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'File is required!',
        });
        return null;
      }

      return data;
    }),
  /**
   * files
   * defaultValue === []
   */
  files: (props?: InputProps) =>
    zod.array(zod.custom<File | string>()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'Files is required!',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Must have at least ${minFiles} items!`,
        });
      }

      return data;
    }),
};
