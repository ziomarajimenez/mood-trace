'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../../../database.types'
import Calendar from '../calendar/calendar'
import LinearChart from '../linearChart/linearChart'

const supabase = createClientComponentClient<Database>()

export default function Stats ({ session }: { session: Session }) {
  const [dataMood, setDataMood] = useState([])
  const [date, setDate] = useState(getCurrentMonthAndYear())
  const [moodAnalysis, setMoodAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function getCurrentMonthAndYear (): string {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${month}-${year}`
  }

  function getMonthStartDate (monthAndYear: string): string {
    const [month, year] = monthAndYear.split('-')
    return `${year}-${month}-01`
  }

  function getMonthEndDate (monthAndYear: string): string {
    const [month, year] = monthAndYear.split('-')
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    return `${year}-${month}-${lastDay.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    setIsLoading(true)
    const getMoodData = async () => {
      const { data: moods } = await supabase
        .from('moods')
        .select()
        .eq('user_id', session.data.user.id)
        .lte('created_at', getMonthEndDate(date))
        .gte('created_at', getMonthStartDate(date))
        .order('created_at', { ascending: true })

      if (moods && moods.length > 0) {
        setDataMood(moods)
        const moodAndDate = moods.map(item => {
          return { 'mood': item.mood, 'date': item.created_at }
        })
        getAnalysis(moodAndDate)
      } else {
        setDataMood([])
        setMoodAnalysis('')
        setIsLoading(false)
      }
    }
    getMoodData()
  }, [date])

  const getAnalysis = async (moods) => {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moods })
      })
      const data = await response.json()
      if (data) {
        setMoodAnalysis(data)
      }
    } catch (error) {
      alert(error.message)
    }
    setIsLoading(false)
  }

  return (
    <section className="flex flex-col justify-center items-center max-w-full h-100">
      {isLoading
        ? <p className='h-full mt-20'> Loading ...</p>
        : <div className='flex flex-col justify-center items-center'>
        <div>
          <Calendar dataMood={dataMood} date={date} setDate={setDate}/>
        {dataMood.length > 0
          ? <LinearChart moods={dataMood} />
          : null}
        </div>
        {moodAnalysis !== '' ? <p className='w-3/4 text-xs text-center mt-2'>{moodAnalysis}</p> : null}
        </div>}
    </section>
  )
}
