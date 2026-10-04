import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const studentSignupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  studentId: z.string().min(5, 'Enter a valid student ID').max(20),
  departmentId: z.string().uuid('Select a department'),
  batchId: z.string().uuid('Select a batch'),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const alumniSignupSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  departmentId: z.string().uuid(),
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear()),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type StudentSignupFormData = z.infer<typeof studentSignupSchema>
export type AlumniSignupFormData = z.infer<typeof alumniSignupSchema>
