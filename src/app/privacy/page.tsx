import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), "mb-6")}>
        &larr; Back to Home
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-slate dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
            <p>
              When you register for BUBT Connect, we collect personal information such as your name, email address, student ID, department, and batch. For alumni, we may also collect employment information.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h3>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verify your identity as a BUBT student or alumni</li>
              <li>Provide and maintain the BUBT Connect platform</li>
              <li>Personalize your experience (e.g., showing relevant department notices)</li>
              <li>Ensure community safety and enforce our guidelines</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2">3. Anonymous Posting</h3>
            <p>
              When using the "Anonymous" feature on the Voice Board, your identity is hidden from other users. However, platform administrators can access author information if a post violates our community guidelines (e.g., hate speech, harassment).
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information. Your account is secured by a password, and we use secure database infrastructure to prevent unauthorized access.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
