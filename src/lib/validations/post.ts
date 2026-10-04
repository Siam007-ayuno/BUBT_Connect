import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  body: z.string().min(10, 'Body must be at least 10 characters').max(10000),
  type: z.enum(['problem', 'suggestion', 'question', 'discussion']),
  categoryId: z.string().uuid('Select a category'),
  departmentId: z.string().uuid().optional().nullable(),
  isAnonymous: z.boolean().default(false),
  improvementSuggestion: z.string().max(2000).optional().nullable(),
})

export const createCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(5000),
  parentId: z.string().uuid().optional().nullable(),
  isAnonymous: z.boolean().default(false),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
