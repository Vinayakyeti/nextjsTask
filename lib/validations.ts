import { z } from "zod";

const sanitizeString = (value: string) => {
  return value.trim().replace(/[\s]+/g, ' ');
};

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters")
    .transform(sanitizeString),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters")
    .transform(sanitizeString),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    errorMap: () => ({ message: "Invalid difficulty level" }),
  }),
  category: z.enum(["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "CODING"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  tags: z
    .array(z.string().min(1).max(30).transform(sanitizeString))
    .max(10, "Maximum 10 tags allowed"),
  companyName: z.string().max(100).optional().transform(sanitizeString),
  companyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid company ID").optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const createPracticeSessionSchema = z.object({
  questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid question ID"),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(5000, "Answer must be less than 5000 characters")
    .transform(sanitizeString),
  duration: z.number().int().positive("Duration must be positive").max(3600, "Duration too long"),
  rating: z.number().int().min(1).max(5).optional(),
});

export const updatePracticeSessionSchema = z.object({
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(5000, "Answer must be less than 5000 characters")
    .optional()
    .transform(sanitizeString),
  rating: z.number().int().min(1).max(5).optional(),
});

export type CreatePracticeSessionInput = z.infer<typeof createPracticeSessionSchema>;
export type UpdatePracticeSessionInput = z.infer<typeof updatePracticeSessionSchema>;

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .transform(sanitizeString),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .transform(sanitizeString),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color (e.g., #3B82F6)")
    .optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .optional()
    .transform(sanitizeString),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const paginationSchema = z.object({
  page: z.number().int().positive("Page must be positive").default(1),
  limit: z.number().int().positive("Limit must be positive").max(100, "Max 100 items per page").default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const addQuestionToCollectionSchema = z.object({
  questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid question ID"),
});

export type AddQuestionToCollectionInput = z.infer<typeof addQuestionToCollectionSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  logo: z.string().url("Invalid logo URL").optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const aiFeedbackSchema = z.object({
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  score: z.number().min(0).max(10),
  suggestions: z.string(),
});

export type AIFeedback = z.infer<typeof aiFeedbackSchema>;
