import { prisma } from './prisma'
import { PrismaUser, PrismaForum, ForumWithUser, ForumWithComments } from '@/types'

// User functions
export async function createUser(data: { email: string; name?: string }) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

// Forum functions
export async function getAllForums() {
  return await prisma.forum.findMany({
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getForumById(id: string) {
  return await prisma.forum.findUnique({
    where: { id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  })
}

export async function createForum(data: {
  title: string
  description?: string
  tags: string[]
  userId: string
}) {
  return await prisma.forum.create({
    data: {
      title: data.title,
      description: data.description,
      tags: data.tags,
      userId: data.userId,
    },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
  })
}

export async function updateForum(
  id: string,
  data: {
    title?: string
    description?: string
    tags?: string[]
  },
  userId: string
) {
  // First check if the forum exists and belongs to the user
  const forum = await prisma.forum.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!forum) {
    throw new Error('Forum not found')
  }

  if (forum.userId !== userId) {
    throw new Error('Unauthorized: You can only update your own forums')
  }

  return await prisma.forum.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      tags: data.tags,
    },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
  })
}

export async function deleteForum(id: string, userId: string) {
  // First check if the forum exists and belongs to the user
  const forum = await prisma.forum.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!forum) {
    throw new Error('Forum not found')
  }

  if (forum.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own forums')
  }

  return await prisma.forum.delete({
    where: { id },
  })
}

// Comment functions
export async function getCommentsByForumId(forumId: string) {
  return await prisma.comment.findMany({
    where: { forumId },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export async function addComment(forumId: string, userId: string, content: string) {
  // First check if the forum exists
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    select: { id: true },
  })

  if (!forum) {
    throw new Error('Forum not found')
  }

  return await prisma.comment.create({
    data: {
      content,
      forumId,
      userId,
    },
    include: {
      user: true,
    },
  })
}

export async function deleteComment(id: string, userId: string) {
  // First check if the comment exists and belongs to the user
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  if (comment.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own comments')
  }

  return await prisma.comment.delete({
    where: { id },
  })
}

// Legacy functions (keeping for backward compatibility)
export async function getForums() {
  return await getAllForums()
}

export async function createComment(data: {
  content: string
  forumId: string
  userId: string
}) {
  return await addComment(data.forumId, data.userId, data.content)
} 