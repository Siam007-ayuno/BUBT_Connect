import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), "mb-6")}>
        &larr; Back to Home
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-slate dark:prose-invert">
          <p className="text-muted-foreground">
            Welcome to BUBT Connect! Our platform is designed to foster connection, learning, and collaboration among students, alumni, and faculty. To maintain a healthy environment, we ask all members to follow these guidelines.
          </p>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">1. Be Respectful</h3>
            <p>
              Treat others with respect. Debate and disagreement are welcome, but personal attacks, insults, and derogatory comments are not allowed.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">2. No Harassment or Hate Speech</h3>
            <p>
              We have a zero-tolerance policy for harassment, bullying, and hate speech. This includes comments targeting race, religion, gender, sexual orientation, disability, or any other protected characteristic.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">3. Anonymous Posting Rules</h3>
            <p>
              The anonymous posting feature is designed for sharing honest thoughts, seeking advice, or asking sensitive questions without fear of judgment. It is <strong>NOT</strong> a shield for abuse.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Do not use anonymity to attack specific individuals.</li>
              <li>Do not spread false information or rumors.</li>
              <li>Administrators can trace anonymous posts back to the author in cases of severe guideline violations.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">4. Consequences for Violations</h3>
            <p>
              Violating these guidelines will result in disciplinary action:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>First offense:</strong> Content removal and a formal warning.</li>
              <li><strong>Second offense:</strong> Temporary mute (inability to post or comment) for up to 7 days.</li>
              <li><strong>Repeated/Severe offenses:</strong> Permanent account ban and potential reporting to university authorities.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mt-6 mb-2 text-primary">5. Reporting</h3>
            <p>
              If you see content that violates these guidelines, please use the "Report" button on the post or comment. Our moderation team reviews all reports carefully.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
