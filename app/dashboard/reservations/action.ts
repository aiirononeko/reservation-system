'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { z } from 'zod'
import { deleteReservationSchema, updateReservationSchema } from './schema'

export const updateReservation = async (
  input: z.infer<typeof updateReservationSchema>,
) => {
  const result = updateReservationSchema.safeParse(input)
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors,
    }
  }

  const supabase = createClient()

  const { error } = await supabase
    .from('reservations')
    .update({
      ...input,
      reservation_date: input.reservation_date,
      start_time: input.start_time,
      end_time: input.end_time,
    })
    .eq('id', input.id)
  if (error) {
    console.error(error.message)
  }

  revalidatePath('/dashboard/reservations')
}

export const deleteReservation = async (
  input: z.infer<typeof deleteReservationSchema>,
) => {
  const result = deleteReservationSchema.safeParse(input)
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors,
    }
  }

  const supabase = createClient()

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', input.id)
  if (error) {
    console.error(error.message)
  }

  revalidatePath('/dashboard/reservations')
}