import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteReservation, updateReservation } from './action'
import { updateReservationSchema } from './schema'
import type { Reservation } from './type'

interface Props {
  reservation: Reservation
  onClose: () => void
}

export const ReservationUpdateForm = ({ reservation, onClose }: Props) => {
  const form = useForm<z.infer<typeof updateReservationSchema>>({
    defaultValues: {
      id: reservation.id,
      reservation_date: reservation.reservation_date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    },
    resolver: zodResolver(updateReservationSchema),
  })

  const handleClickDelete = async () => {
    try {
      await deleteReservation(form.getValues('id'))
      onClose()
      toast.success('予約を削除しました')
    } catch (e) {
      toast.error('予約の削除に失敗しました')
    }
  }

  const onSubmit = async (values: z.infer<typeof updateReservationSchema>) => {
    try {
      await updateReservation(values)
      onClose()
      toast.success('予約内容を変更しました')
    } catch (e) {
      // TODO: Rollbackできるようにする
      toast.error('予約内容の変更に失敗しました')
    }
  }

  // @ts-expect-error because JOINした時の型定義あとでやる
  const { customers, menus, users } = reservation

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <div>
          <p>顧客: {customers.name}</p>
          <p>メニュー: {menus.name}</p>
          <p>スタッフ: {users.name}</p>
        </div>
        <FormField
          control={form.control}
          name='reservation_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>予約日時</FormLabel>
              <FormControl>
                <Input {...field} type='date' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='start_time'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>予約開始時刻</FormLabel>
              <FormControl>
                <Input {...field} type='time' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='end_time'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>予約終了時刻</FormLabel>
              <FormControl>
                <Input {...field} type='time' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-row space-x-4'>
          <Button
            type='button'
            variant='destructive'
            disabled={form.formState.isLoading}
            onClick={handleClickDelete}
            className='w-full font-bold'
          >
            {form.formState.isSubmitting ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : (
              <>削除</>
            )}
          </Button>
          <Button
            type='submit'
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              form.formState.isLoading
            }
            className='w-full font-bold'
          >
            {form.formState.isSubmitting ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : (
              <>変更</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
