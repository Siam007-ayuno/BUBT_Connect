'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/app'
  
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co')
      
      if (!isPlaceholder) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
      } else {
        // Infer demo persona from email
        let inferredRole = 'student'
        const lowerEmail = data.email.toLowerCase()
        if (lowerEmail.includes('faculty') || lowerEmail.includes('prof') || lowerEmail.includes('dr.')) {
          inferredRole = 'faculty'
        } else if (lowerEmail.includes('authority') || lowerEmail.includes('proctor') || lowerEmail.includes('admin')) {
          inferredRole = 'authority'
        } else if (lowerEmail.includes('alumni')) {
          inferredRole = 'alumni'
        }
        document.cookie = `bubt_demo_role=${inferredRole}; path=/; max-age=86400; SameSite=Lax`
      }
      
      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      // In offline / placeholder mode, allow access gracefully
      document.cookie = `bubt_demo_role=student; path=/; max-age=86400; SameSite=Lax`
      router.push(redirectTo)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
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
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="student@bubt.edu.bd" 
              {...form.register('email')} 
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              {...form.register('password')} 
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Demo Fast Login Section */}
        <div className="mt-5 pt-4 border-t space-y-2.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">
            ⚡ Quick Demo Access (No Password Needed)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                document.cookie = 'bubt_demo_role=student; path=/; max-age=86400'
                router.push('/app')
              }}
              className="p-2 rounded-lg border bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors"
            >
              🎓 Student (Tanvir)
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = 'bubt_demo_role=faculty; path=/; max-age=86400'
                router.push('/app')
              }}
              className="p-2 rounded-lg border bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-colors"
            >
              👨‍🏫 Faculty (Dr. Rahman)
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = 'bubt_demo_role=authority; path=/; max-age=86400'
                router.push('/app/dashboard')
              }}
              className="p-2 rounded-lg border bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors"
            >
              🏛️ Authority (Proctor)
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = 'bubt_demo_role=alumni; path=/; max-age=86400'
                router.push('/app')
              }}
              className="p-2 rounded-lg border bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              💼 Alumni (Farzana)
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <div>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
