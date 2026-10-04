import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ className, size = 'default' }: { className?: string, size?: 'sm' | 'default' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', default: 'h-6 w-6', lg: 'h-10 w-10' }
  return <Loader2 className={cn('animate-spin text-muted-foreground', sizes[size], className)} />
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
