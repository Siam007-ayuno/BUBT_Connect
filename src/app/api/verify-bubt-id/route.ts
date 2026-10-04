import { NextRequest, NextResponse } from 'next/server'
import { verifyBubtId } from '@/lib/bubt-verification'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentId, fullName, department, batch } = body

    if (!studentId || typeof studentId !== 'string') {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const result = await verifyBubtId(studentId, {
      fullName,
      department,
      batch,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Verification service error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('id') || searchParams.get('studentId') || ''
  const fullName = searchParams.get('name') || ''
  const department = searchParams.get('dept') || ''
  const batch = searchParams.get('batch') || ''

  if (!studentId) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 })
  }

  const result = await verifyBubtId(studentId, {
    fullName,
    department,
    batch,
  })

  return NextResponse.json(result)
}
