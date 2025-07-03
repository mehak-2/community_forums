import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types'

export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function getServerSession() {
  const supabase = await createServerSupabase()
  
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Error in getServerSession:', error)
    return null
  }
}

export async function getServerUser() {
  const session = await getServerSession()
  return session?.user ?? null
}

export async function requireServerAuth() {
  const user = await getServerUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
} 