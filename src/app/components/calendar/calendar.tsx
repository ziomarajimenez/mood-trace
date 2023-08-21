import React, { useState } from 'react'
import Image from 'next/image'

interface MoodData {
  created_at: string
  mood: string
}

interface CalendarProps {
  dataMood: MoodData[]
  setDate: (date: string) => void
  date: string
}

const Calendar: React.FC<CalendarProps> = ({ dataMood, setDate, date }) => {
  const month = date.split('-')[0] - 1
  const year = date.split('-')[1]
  const [currentDate, setCurrentDate] = useState(new Date(year, month, 1))

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  function formatDate (date: Date): string {
    const month: string = String(date.getMonth() + 1).padStart(2, '0')
    const year: string = String(date.getFullYear())
    return month + '-' + year
  }

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    setCurrentDate(newDate)
    const dateFormatted = formatDate(newDate)
    setDate(dateFormatted)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    setCurrentDate(newDate)
    const dateFormatted = formatDate(newDate)
    setDate(dateFormatted)
  }

  const getMoodForDay = (dayNumber: number): string | undefined => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)
    const moodData = dataMood.find(data => data.created_at.startsWith(date.toISOString().split('T')[0]))
    return moodData?.mood
  }

  return (
    <div className="mb-4 md:w-72 xs:h-52 w-96 h-65 p-4 border border-current">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className="grid grid-cols-7 xs:gap-0 gap-2">
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={`empty-${index}`} className="text-center text-gray-400 md:h-8 h-10">-</div>
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const dayNumber = index + 1
          const moodForDay = getMoodForDay(dayNumber)
          const imagePath = (moodForDay != null) ? `/images/${moodForDay}.png` : ''

          return (
            <div key={`day-${dayNumber}`} className="text-xs md:h-8 h-10 flex flex-col justify-between">
              <p className="text-right">{dayNumber}</p>
              {(moodForDay != null) && (
                <div className="flex items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={`Mood: ${moodForDay}`}
                    width={20}
                    height={20}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
