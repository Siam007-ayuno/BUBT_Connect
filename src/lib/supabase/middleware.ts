import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')

  // If in demo / placeholder mode, allow authenticated demo browsing without blocking or hanging
  if (isPlaceholder) {
    // If user has demo role cookie or accesses app, allow through
    const demoRole = request.cookies.get('bubt_demo_role')?.value || 'student'
    
    // In demo mode, if unauthenticated user tries to visit auth pages with redirect, or /app, let them proceed
    const res = NextResponse.next({ request })
    if (!request.cookies.has('bubt_demo_role')) {
      res.cookies.set('bubt_demo_role', demoRole, { path: '/', httpOnly: false })
    }
    return res
  }

  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()

    // Redirect unauthenticated users trying to access /app
    if (!user && request.nextUrl.pathname.startsWith('/app')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/signup'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/app'
      return NextResponse.redirect(url)
    }
  } catch {
    // If Supabase call fails, pass through
  }

  return supabaseResponse
}
