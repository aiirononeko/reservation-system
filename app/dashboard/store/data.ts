'use server'

import { createClient } from '@/lib/supabase/server'
import type { AuthUser } from '@supabase/supabase-js'

export const getStore = async (user: AuthUser) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', user.user_metadata.store_id)
    .single()
  if (error) {
    console.error(error.message)
    throw error
  }

  return data
}
