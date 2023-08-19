'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../../../database.types'

import MoodPage from '../MoodPage/MoodPage'
import Stats from '../Stats/Stats'
const supabase = createClientComponentClient<Database>()

export default function Content({ session }) {
  const [isSelected, setIsSelected] = useState('today')

  const handleOptionClick = (option: string) => {
    setIsSelected(option)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  let renderedComponent

  if (isSelected === 'today') {
    renderedComponent = <MoodPage session={session}/>
  } else if (isSelected === 'stats') {
    renderedComponent = <Stats />
  }

  return (
    <main className="flex flex-col items-center max-w-full h-screen">
      <section className="flex flex-col items-center justify-center items-center w-screen min-h-full">
        <nav className="border-black border-b w-3/4 flex justify-center mb-2">
          <div className="flex w-4/6 justify-between mt-2 mb-2">
            <h1
              className={`text-xl cursor-pointer ${isSelected === 'today' ? 'font-semibold text-button' : 'text-black'}`}
              onClick={() => { handleOptionClick('today') }}
            >
              today
            </h1>
            <h1
              className={`text-xl cursor-pointer  ${isSelected === 'stats' ? 'font-semibold text-button' : 'text-black'}`}
              onClick={() => { handleOptionClick('stats') }}
            >
              stats
            </h1>
            <h1
              className={`text-xl cursor-pointer  ${isSelected === 'logout' ? 'font-semibold text-button' : 'text-black'}`}
              onClick={() => {
                handleSignOut()
              }}
            >
              log out
            </h1>
          </div>
        </nav>
        {renderedComponent}
        <div className="border-black border-b w-3/4 flex justify-center mt-8 mb-8"></div>
      </section>
    </main>
  )
}
