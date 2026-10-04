'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface SafeAttachmentImageProps {
  url?: string | null
  alt?: string
  className?: string
  containerClassName?: string
}

export function SafeAttachmentImage({
  url,
  alt = 'Attachment preview',
  className = 'object-cover w-full h-full',
  containerClassName = 'mb-3.5 rounded-lg overflow-hidden border max-h-64 relative aspect-video bg-muted',
}: SafeAttachmentImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!url || typeof url !== 'string' || url.trim() === '' || hasError) {
    return null
  }

  // Basic sanity check for valid URL or path
  const trimmed = url.trim()
  const isValidUrl =
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')

  if (!isValidUrl) {
    return null
  }

  return (
    <div className={containerClassName}>
      <img
        src={trimmed}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className={className}
      />
    </div>
  )
}
