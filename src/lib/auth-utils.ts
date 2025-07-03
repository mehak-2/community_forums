import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { Database } from '@/types'
import { getUserByEmail, createUser } from './db'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getCurrentUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function getOrCreatePrismaUser(request: NextRequest) {
  const supabaseUser = await requireAuth(request)
  
  if (!supabaseUser.email) {
    throw new Error('User email is required')
  }
  
  // Check if user exists in Prisma database by email
  let dbUser = await getUserByEmail(supabaseUser.email)
  
  if (!dbUser) {
    // Create user in Prisma database using Supabase user data
    dbUser = await createUser({
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
    })
  }
  
  return dbUser
} 