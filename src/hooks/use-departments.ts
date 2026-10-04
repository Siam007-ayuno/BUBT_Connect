'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useDepartments() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name_en')
      if (error) throw error
      return data
    },
  })
}

export function useBatches(departmentId?: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['batches', departmentId],
    queryFn: async () => {
      if (!departmentId) return []
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('department_id', departmentId)
        .order('year', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!departmentId,
  })
}
