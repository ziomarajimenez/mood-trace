import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home () {
  const supabase = createServerComponentClient({ cookies })
  const { data: moods } = await supabase.from('moods').select()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hi
      <pre>
        {
          JSON.stringify(moods, null, 2)
        }
      </pre>
    </main>
  )
}
