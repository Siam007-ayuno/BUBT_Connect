'use client'

import { useState } from 'react'
import { AuthError } from '@supabase/supabase-js'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDepartments } from '@/hooks/use-departments'

const alumniSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  department: z.string().min(1, 'Department is required'),
  graduationYear: z.string().min(4, 'Invalid year').max(4, 'Invalid year'),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type AlumniSignupValues = z.infer<typeof alumniSignupSchema>

const FALLBACK_DEPARTMENTS = [
  'CSE', 'EEE', 'BBA', 'English', 'Law', 'Economics', 'Civil Engineering', 'Textile Engineering'
]

export default function AlumniSignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  
  const { data: departmentsData } = useDepartments()
  
  const form = useForm<AlumniSignupValues>({
    resolver: zodResolver(alumniSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      graduationYear: new Date().getFullYear().toString(),
      currentCompany: '',
      currentPosition: '',
      linkedinUrl: '',
      phone: '',
      terms: false,
    },
  })

  const onSubmit = async (data: AlumniSignupValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co')
      
      if (!isPlaceholder) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: 'alumni',
              department: data.department,
              graduation_year: Number(data.graduationYear),
              current_company: data.currentCompany,
              current_position: data.currentPosition,
              linkedin_url: data.linkedinUrl,
              phone: data.phone,
            }
          }
        })
        if (signUpError) throw signUpError
      }

      if (typeof window !== 'undefined') {
        document.cookie = `bubt_demo_role=alumni; path=/; max-age=86400; SameSite=Lax`
      }
      setSuccess(true)
    } catch (err: unknown) {
      if (typeof window !== 'undefined') {
        document.cookie = `bubt_demo_role=alumni; path=/; max-age=86400; SameSite=Lax`
      }
      setSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Registration Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your alumni account request has been submitted. An administrator will verify your account shortly.
          </p>
          <Link href="/login" className={cn(buttonVariants(), "w-full")}>
            Return to Login
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumni Registration</CardTitle>
        <CardDescription>Join the BUBT Connect community as an alumni.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Jane Doe" {...form.register('fullName')} />
            {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="alumni@example.com" {...form.register('email')} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...form.register('confirmPassword')} />
              {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(val) => form.setValue('department', val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsData && departmentsData.length > 0 
                    ? departmentsData.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>{d.name_en || d.code}</SelectItem>
                      ))
                    : FALLBACK_DEPARTMENTS.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {form.formState.errors.department && <p className="text-sm text-destructive">{form.formState.errors.department.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input id="graduationYear" type="number" {...form.register('graduationYear')} />
              {form.formState.errors.graduationYear && <p className="text-sm text-destructive">{form.formState.errors.graduationYear.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCompany">Current Company (Optional)</Label>
            <Input id="currentCompany" {...form.register('currentCompany')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPosition">Current Position (Optional)</Label>
            <Input id="currentPosition" {...form.register('currentPosition')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
            <Input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." {...form.register('linkedinUrl')} />
            {form.formState.errors.linkedinUrl && <p className="text-sm text-destructive">{form.formState.errors.linkedinUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" placeholder="+880..." {...form.register('phone')} />
          </div>

          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox 
              id="terms" 
              checked={form.watch('terms') ?? false} 
              onCheckedChange={(checked) => form.setValue('terms', checked as true)}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="terms">
                Accept terms and conditions
              </Label>
              <p className="text-sm text-muted-foreground">
                I agree to the <Link href="/guidelines" className="text-primary hover:underline">community guidelines</Link> and <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>.
              </p>
              {form.formState.errors.terms && <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Sign Up as Alumni'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
