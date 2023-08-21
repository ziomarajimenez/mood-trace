'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import type { Database } from '../../../../database.types'

const supabase = createClientComponentClient<Database>()
const currentDateFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export default function MoodPage ({ session }: { session: Session }) {
  const [description, setDescription] = useState('')
  const [mood, setMood] = useState('')
  const [dataMood, setDataMood] = useState({})
  const [showUpdate, setShowUpdate] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const getMoodData = async () => {
      const { data: moods } = await supabase
        .from('moods')
        .select()
        .eq('user_id', session.data.user.id)
        .eq('created_at', getCurrentDate())
      if (moods != null && moods.length > 0) {
        setDataMood(moods[0])
        setMood(moods[0].mood)
      }
      setIsLoading(false)
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

  function getCurrentDate (): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleClick = (mood: string) => {
    setMood(mood)
  }

  const handleContinue = async () => {
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
        description,
        mood: data?.match,
        user_id: session.data.user.id,
        created_at: getCurrentDate(),
        selected_mood: mood
      }
      setDataMood(moodObject)
      const { error } = await supabase
        .from('moods')
        .insert(moodObject)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleUpdate = async () => {
    console.log(session, session.data.user)
    const { data, error } = await supabase
      .from('moods')
      .update({ selected_mood: dataMood.mood })
      .eq('id', dataMood.id)
      .select()
    if (error != null) {
      alert(error?.message)
    }
    if (data != null) {
      setDataMood(data[0])
    }
  }

  const emotions = ['happy', 'neutral', 'sad', 'angry']

  return (
    <main className="flex flex-col justify-center items-center max-w-full h-100">
      {isLoading
        ? <div className='h-full mt-20'>Loading...</div>
        : <section className="flex flex-col items-center justify-center items-center w-screen min-h-full">
            {Object.keys(dataMood).length === 0
              ? <>
                  <p className='text-l mb-8'>{currentDateFormatted}</p>
                  <p className='sm:text-xl text-2xl mb-8 text-center'> How are you feeling today? </p>
                  <div className="flex xs:w-4/5">
                  {emotions.map((emotion) => (
                      <div key={emotion} className="text-center w-1/4 mb-6">
                        <div
                        key={emotion}
                        className={`text-center rounded-lg cursor-pointer hover:bg-opacity-20 ${tailwindStyleClasses[emotion].hover} ${emotion === mood ? tailwindStyleClasses[emotion].background : ''}`}
                        onClick={() => { handleClick(emotion) }}
                      >
                          <Image
                            src={`/images/${emotion}.png`}
                            alt={`${emotion} Image`}
                            width={100}
                            height={50}
                          />
                        <p className={`${tailwindStyleClasses[emotion].text} text-center`}>{emotion}</p>
                        </div>
                      </div>
                  ))}
                  </div>
                  <p className='sm:text-xl text-2xl text-center mb-8'> Tell us about your day:</p>
                  <textarea
                    onChange={(e) => { setDescription(e.target.value) }}
                    className="rounded-lg bg-indigo-50 h-1/5 w-3/5 bg:w-4/5 mb-4 pt-2 pl-2"
                  />
                  <button className="bg-button text-white rounded-lg lg:w-1/5 w-28 h-10 disabled:opacity-50" disabled={!description || !mood} onClick={handleContinue}>continue</button>
                </>
              : <div className={'flex flex-col items-center'}>
                <p className='text-2xl'> you&apos;re </p>
                <p className='text-2xl'> feeling <span className={`${mood && tailwindStyleClasses[dataMood.selected_mood].text} font-bold`}>{dataMood.selected_mood}</span></p>
                <Image
                  src={`/images/${dataMood.selected_mood}.png`}
                  alt={`${mood} Image`}
                  width={200}
                  height={150}
                />
                <p className='xs:text-sm text-2xl w-2/4 xs:mt-6 mt-12 text-center'>{dataMood.analysis}</p>
                {dataMood.selected_mood !== dataMood.mood && showUpdate
                  ? <section className="w-2/4 mt-8 text-center text-sm">
                    <p className="xs:text-xs mb-4">You selected <span className="font-bold">{dataMood.selected_mood}</span> but we feel you might be also feeling <span className="font-bold">{dataMood.mood}</span>. Would you like to change your selection?</p>
                    <button className ="rounded-lg bg-button h-8 w-1/4 mb-4 text-white" onClick={handleUpdate}>Yes</button>
                    <button className ="rounded-lg border border-button h-8 w-1/4 ml-4" onClick={() => { setShowUpdate(false) }}>No</button>
                  </section>
                  : null}
            </div>
            }
          </section>
      }
    </main>
  )
}
