import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Content from './components/content/content'

export default async function Home () {
  const supabase = createServerComponentClient({ cookies })
  const session = await supabase.auth.getUser()

  if (session.data.user === null) {
    redirect('/login')
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <Content session={session}/>
    </main>
  )
}
