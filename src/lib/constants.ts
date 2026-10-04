export const APP_NAME = 'BUBT Connect'
export const UNIVERSITY_NAME = 'Bangladesh University of Business and Technology'
export const UNIVERSITY_SHORT = 'BUBT'

export const ESCALATION_THRESHOLD = parseInt(process.env.NEXT_PUBLIC_ESCALATION_THRESHOLD || '25', 10)

export const POST_TYPES = [
  { value: 'problem', labelKey: 'voiceBoard.problem', color: 'destructive' },
  { value: 'suggestion', labelKey: 'voiceBoard.suggestion', color: 'warning' },
  { value: 'question', labelKey: 'voiceBoard.question', color: 'info' },
  { value: 'discussion', labelKey: 'voiceBoard.discussion', color: 'secondary' },
] as const

export const POST_STATUSES = [
  { value: 'open', labelKey: 'voiceBoard.statusOpen', color: 'secondary' },
  { value: 'under_review', labelKey: 'voiceBoard.statusUnderReview', color: 'warning' },
  { value: 'in_progress', labelKey: 'voiceBoard.statusInProgress', color: 'info' },
  { value: 'resolved', labelKey: 'voiceBoard.statusResolved', color: 'success' },
  { value: 'rejected', labelKey: 'voiceBoard.statusRejected', color: 'destructive' },
] as const

export const NOTICE_CATEGORIES = [
  { value: 'exam', labelKey: 'notices.exam' },
  { value: 'admission', labelKey: 'notices.admission' },
  { value: 'result', labelKey: 'notices.result' },
  { value: 'holiday', labelKey: 'notices.holiday' },
  { value: 'fees', labelKey: 'notices.fees' },
  { value: 'scholarship', labelKey: 'notices.scholarship' },
  { value: 'general', labelKey: 'notices.general' },
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_DOC_TYPES = ['application/pdf']
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES]

export const ITEMS_PER_PAGE = 20
