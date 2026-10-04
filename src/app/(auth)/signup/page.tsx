import Link from 'next/link'
import { GraduationCap, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SignupRoleSelectionPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">Select your role to get started</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <CardTitle>Student</CardTitle>
            <CardDescription>
              Current BUBT student looking to connect with peers and stay updated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup/student" className={cn(buttonVariants(), "w-full")}>
              Sign Up as Student
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <CardTitle>Alumni</CardTitle>
            <CardDescription>
              BUBT graduate looking to network and give back to the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup/alumni" className={cn(buttonVariants({ variant: 'outline' }), "w-full")}>
              Sign Up as Alumni
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 text-center text-sm text-muted-foreground">
        <p>
          Faculty and staff accounts are created by administrators.
        </p>
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
