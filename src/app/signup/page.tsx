'use client'

import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useRouter, redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Database } from '../../../database.types'
import Image from 'next/image'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()
  }, [])

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    })

    if (error !== null) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Please verify your email address to continue')
    }
    router.refresh()
  }

  if (session !== null) {
    redirect('/')
  }

  return (
    <main className="flex flex-col items-center max-w-full h-screen">
      <section className="flex flex-col items-center justify-center items-center w-screen min-h-full">
      <p className="font-medium xs:text-2xl text-3xl">Create an account</p>
      <Image
        src="/images/welcome.jpg"
        alt="Welcome Image"
        width={200}
        height={300}
      />
      <p className="font-medium text-xl">E-mail:</p>
      <input className="rounded-lg bg-indigo-50 h-12 sm:w-1/2 w-2/5 mb-4" name="email" onChange={(e) => { setEmail(e.target.value) }}
      value={email} />
      <p className="font-medium text-xl">Password:</p>
      <input
          type="password"
          name="password"
          onChange={(e) => { setPassword(e.target.value) }}
          value={password}
          className="rounded-lg bg-indigo-50 h-12 sm:w-1/2 w-2/5 mb-4"
      />
      {successMessage.length !== 0 ? <p className="sm:text-xs mb-2"> <b>{successMessage}</b> </p> : null}
      {errorMessage.length !== 0 ? <p className="sm:text-xs mb-2"> <b>{errorMessage}</b> </p> : null}
      <button className="bg-button text-white rounded-lg w-28 h-10 xs:w-2/5 w-1/6 mb-4" onClick={handleSignUp}>Sign up</button>
      <p> Already have an account? <b><Link href="/login"><u>LOG IN</u></Link></b></p>
      </section>
    </main>
  )
}
