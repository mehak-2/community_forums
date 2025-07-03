import { supabase } from './supabase'

// Helper function to get auth headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (session?.access_token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

// Forum API functions
export async function getAllForums() {
  const response = await fetch('/api/forums')
  if (!response.ok) {
    throw new Error('Failed to fetch forums')
  }
  return response.json()
}

export async function getForumById(id: string) {
  const response = await fetch(`/api/forums/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch forum')
  }
  return response.json()
}

export async function createForum(data: {
  title: string
  description?: string
  tags?: string[]
}) {
  const headers = await getAuthHeaders()
  const response = await fetch('/api/forums', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create forum')
  }
  
  return response.json()
}

export async function updateForum(
  id: string,
  data: {
    title?: string
    description?: string
    tags?: string[]
  }
) {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/forums/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update forum')
  }
  
  return response.json()
}

export async function deleteForum(id: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/forums/${id}`, {
    method: 'DELETE',
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete forum')
  }
  
  return response.json()
}

// Comment API functions
export async function getCommentsByForumId(forumId: string) {
  const response = await fetch(`/api/forums/${forumId}/comments`)
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  return response.json()
}

export async function addComment(forumId: string, content: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/forums/${forumId}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add comment')
  }
  
  return response.json()
}

export async function deleteComment(id: string) {
  const headers = await getAuthHeaders()
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete comment')
  }
  
  return response.json()
} 