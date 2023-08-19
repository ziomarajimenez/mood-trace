'use client'

import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Database } from '../../../database.types'
import Image from 'next/image'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()
  }, [])

  const handleLogIn = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    setSession(data.session)
  }

  if (session !== null) {
    redirect('/')
  }

  return (
    <main className="flex flex-col max-w-full h-screen">
      <section className="flex flex-col items-center justify-center items-center w-screen min-h-full">
        <p className="font-medium text-3xl">Welcome!</p>
        <Image
          src="/images/welcome.jpg"
          alt="Welcome Image"
          width={200}
          height={300}
        />
        <p className="font-medium text-xl">E-mail:</p>
        <input
          className="rounded-lg bg-indigo-50 h-12 lg:w-1/4 mb-4"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          value={email}
        />
        <p className="font-medium text-xl">Password:</p>
        <input
          type="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          value={password}
          className="rounded-lg bg-indigo-50 h-12 lg:w-1/4 mb-4"
        />
        <button
          className="bg-button text-white rounded-lg lg:w-1/6 w-28 h-10 mb-4"
          onClick={handleLogIn}
        >
          Log In
        </button>
        <p> Don't have an account? <b><Link href="/signup"><u>SIGN UP</u></Link></b></p>
      </section>
    </main>
  )
}
