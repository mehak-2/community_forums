export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

export interface PrismaUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

export interface PrismaForum {
  id: string
  title: string
  description: string | null
  tags: string[]
  createdAt: Date
  userId: string
}

export interface PrismaComment {
  id: string
  content: string
  createdAt: Date
  forumId: string
  userId: string
}

export type ForumWithUser = PrismaForum & {
  user: PrismaUser
}

export type CommentWithUser = PrismaComment & {
  user: PrismaUser
}

export type ForumWithComments = PrismaForum & {
  user: PrismaUser
  comments: CommentWithUser[]
} 