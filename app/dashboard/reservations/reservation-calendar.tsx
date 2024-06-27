'use client'

import type { Database } from '@/types/supabase'
import { useMemo, useState } from 'react'
import { ReservationCalendarHeader } from './reservation-calendar-header'
import { ReservationCard } from './reservation-card'
import { ReservationModal } from './reservation-modal'
import type { ReservationType } from './type'

interface Props {
  reservations: ReservationType[]
}

export const ReservationCalendar: React.FC<Props> = ({ reservations }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationType | null>(null)

  const getWeekDates = useMemo(() => {
    const today = new Date(currentDate)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      return date
    })
  }, [currentDate])

  const hours = Array.from({ length: 17 }, (_, i) => i + 7) // 7時から23時まで

  const isReservationInHour = (
    date: Date,
    hour: number,
    reservation: Database['public']['Tables']['reservations']['Row'],
  ) => {
    const reservationDate = new Date(reservation.reservation_date)
    const startHour = parseInt(reservation.start_time.split(':')[0])
    const endHour = parseInt(reservation.end_time.split(':')[0])
    return (
      reservationDate.getDate() === date.getDate() &&
      reservationDate.getMonth() === date.getMonth() &&
      reservationDate.getFullYear() === date.getFullYear() &&
      startHour <= hour &&
      endHour > hour
    )
  }

  const handleReservationClick = (reservation: ReservationType) => {
    setSelectedReservation(reservation)
  }

  const handleCloseModal = () => {
    setSelectedReservation(null)
  }

  const handleEditReservation = (reservation: ReservationType) => {
    // 編集ロジックをここに実装
    console.log('Edit reservation:', reservation)
    handleCloseModal()
  }

  const handleDeleteReservation = (reservationId: number) => {
    // 削除ロジックをここに実装
    console.log('Delete reservation:', reservationId)
    handleCloseModal()
  }

  return (
    <div className='w-full'>
      <ReservationCalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        weekDates={getWeekDates}
      />
      <div className='flex overflow-x-auto'>
        <div className='sticky left-0 z-10'>
          <div className='h-10 w-16'></div>
          {hours.map((hour) => (
            <div
              key={hour}
              className='flex h-14 w-16 items-start justify-start text-sm text-gray-500'
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>
        <div className='grow'>
          <div className='grid grid-cols-7'>
            {getWeekDates.map((date, dateIndex) => (
              <div key={dateIndex}>
                <div className='sticky top-0 z-10 border-b border-gray-200 p-2 text-center'>
                  <div className='text-sm font-bold'>{date.getDate()}</div>
                  <div className='text-xs text-gray-500'>
                    {date.toLocaleDateString('ja-JP', { weekday: 'short' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='relative grid w-[975px] grid-cols-7 gap-px bg-gray-100 md:w-full'>
            {getWeekDates.map((date, dateIndex) => (
              <div key={dateIndex} className='bg-background'>
                {hours.map((hour) => {
                  const reservationsInHour = reservations.filter(
                    (reservation) =>
                      isReservationInHour(date, hour, reservation),
                  )
                  return (
                    <div
                      key={hour}
                      className='relative h-14 border-b border-gray-100'
                    >
                      {reservationsInHour.map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          handleReservationClick={handleReservationClick}
                          reservation={reservation}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReservationModal
        isOpen={!!selectedReservation}
        onClose={handleCloseModal}
        reservation={selectedReservation}
        onEdit={handleEditReservation}
        onDelete={handleDeleteReservation}
      />
    </div>
  )
}
