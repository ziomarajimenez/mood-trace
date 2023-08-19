'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import type { Database } from '../../../../database.types'

const supabase = createClientComponentClient<Database>()

export default function MoodPage ({ session }) {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const currentDate = new Date().toISOString().slice(0, 10)
  const [description, setDescription] = useState('')
  const [mood, setMood] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dataMood, setDataMood] = useState({})

  useEffect(() => {
    const getMoodData = async () => {
      const { data: moods } = await supabase
        .from('moods')
        .select()
        .eq('user_id', session.data.user.id)
        .eq('created_at', currentDate)
      if (moods && moods.length > 0) {
        setDataMood(moods[0])
        setMood(moods[0].mood)
      }
    }
    getMoodData()
  }, [])

  const tailwindStyleClasses = {
    happy: {
      background: 'bg-happy bg-opacity-20',
      hover: 'hover:bg-happy',
      text: 'text-happy'
    },
    neutral: {
      background: 'bg-neutral bg-opacity-20',
      hover: 'hover:bg-neutral',
      text: 'text-neutral'
    },
    sad: {
      background: 'bg-sad bg-opacity-20',
      hover: 'hover:bg-sad',
      text: 'text-sad'
    },
    angry: {
      background: 'bg-angry bg-opacity-20',
      hover: 'hover:bg-angry',
      text: 'text-angry'
    }
  }

  const handleClick = (label: string) => {
    setMood(label)
  }

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      })
      const data = await response.json()
      const moodObject = {
        analysis: data.analysis,
        description: description,
        mood: mood
      }
      setDataMood(moodObject)
    } catch (error) {
      alert(error.message)
    }
    setIsLoading(false)
  }

  const emotions = ['happy', 'neutral', 'sad', 'angry']

  return (
    <main className="flex flex-col items-center max-w-full h-screen">
     <section className="flex flex-col items-center justify-center items-center w-screen min-h-full">
      {Object.keys(dataMood).length === 0 ?
      <>
        <p className='text-l mb-12'>{currentDateFormatted}</p>
        <p className='text-2xl mb-12'> How are you feeling today? </p>
        <div className="flex w-5/12">
        {emotions.map((emotion) => (
            <div key={emotion} className="text-center w-1/4 mb-6">
              <div
              key={emotion}
              className={`text-center rounded-lg cursor-pointer hover:bg-opacity-20 ${tailwindStyleClasses[emotion].hover} ${emotion === mood ? tailwindStyleClasses[emotion].background : '' }`}
              onClick={() => { handleClick(emotion) }}
            >
                <Image
                  src={`/images/${emotion}.png`}
                  alt={`${emotion} Image`}
                  width={200}
                  height={150}
                />
              <p className={`${tailwindStyleClasses[emotion].text} text-center`}>{emotion}</p>
              </div>
            </div>
        ))}
        </div>
        <p className='text-2xl mb-8'> Tell us about your day:</p>
        <textarea
          onChange={(e) => { setDescription(e.target.value) }}
          className="rounded-lg bg-indigo-50 h-48 w-5/12 mb-4 pt-2 pl-2"
        />
        <button className="bg-button text-white rounded-lg lg:w-1/5 w-28 h-10 disabled:opacity-50" disabled={!description || !mood} onClick={handleContinue}>continue</button>
      </>
      :
      <div className={'flex flex-col items-center'}>
        <p className='text-2xl'> you're </p>
        <p className='text-2xl mb-12'> feeling <span className={`${mood && tailwindStyleClasses[mood].text} font-bold`}>{mood}</span></p>
        <Image
          src={`/images/${mood}.png`}
          alt={`${mood} Image`}
          width={200}
          height={150}
        />
        <p className='text-2xl w-2/4 mt-12 text-center'>{dataMood.analysis}</p>
        {mood !== dataMood.mood ?
          <section className="w-2/4 mt-8 text-center text-sm">
            <p className="mb-4">You selected <span className="font-bold">{mood}</span> but we feel you might be also feeling <span className="font-bold">{dataMood.mood}</span>. Would you like to change your selection?</p>
            <button className ="rounded-lg bg-button h-8 lg:w-1/6 mb-4 text-white" onClick={() => setMood(dataMood.mood)}>Yes</button>
          </section>
          : null}
      </div>}
      </section>
    </main>
  )
}
