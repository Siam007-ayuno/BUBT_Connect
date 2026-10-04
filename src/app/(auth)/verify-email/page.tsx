import Link from 'next/link'
import { CheckCircle2, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  const isSuccess = searchParams.success === 'true'

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          ) : (
            <Mail className="h-12 w-12 text-primary" />
          )}
        </div>
        <CardTitle>{isSuccess ? 'Email Verified!' : 'Check your email'}</CardTitle>
        <CardDescription>
          {isSuccess
            ? 'Your email has been successfully verified.'
            : 'We sent you an email with a link to verify your account.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSuccess && (
          <p className="text-sm text-muted-foreground">
            If you don't see it, check your spam folder.
          </p>
        )}
        <div className="flex flex-col space-y-2">
          {isSuccess ? (
            <Link href="/app" className={cn(buttonVariants(), "w-full")}>
              Continue to App
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants(), "w-full")}>
                Back to Login
              </Link>
              <Button variant="outline" className="w-full">
                Resend verification email
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
