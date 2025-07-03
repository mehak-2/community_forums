import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
    },
  })

  // Create dummy forums
  const forum1 = await prisma.forum.create({
    data: {
      title: 'Welcome to the Community!',
      description: 'Introduce yourself and get to know other members of our community.',
      tags: ['welcome', 'introduction', 'community'],
      userId: user1.id,
    },
  })

  const forum2 = await prisma.forum.create({
    data: {
      title: 'Tech Discussion',
      description: 'Share your thoughts on the latest technology trends and innovations.',
      tags: ['technology', 'programming', 'innovation'],
      userId: user2.id,
    },
  })

  const forum3 = await prisma.forum.create({
    data: {
      title: 'Project Showcase',
      description: 'Show off your latest projects and get feedback from the community.',
      tags: ['projects', 'showcase', 'feedback'],
      userId: user3.id,
    },
  })

  const forum4 = await prisma.forum.create({
    data: {
      title: 'General Questions',
      description: 'Ask any questions you have - no question is too small!',
      tags: ['questions', 'help', 'support'],
      userId: user1.id,
    },
  })

  // Create dummy comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Welcome to the community! Great to have you here.',
        forumId: forum1.id,
        userId: user2.id,
      },
      {
        content: 'Thanks for the warm welcome! Excited to be part of this community.',
        forumId: forum1.id,
        userId: user3.id,
      },
      {
        content: 'I love how friendly everyone is here! 😊',
        forumId: forum1.id,
        userId: user1.id,
      },
      {
        content: 'Has anyone tried the new React 19 features? The new hooks are amazing!',
        forumId: forum2.id,
        userId: user1.id,
      },
      {
        content: 'Yes! The new use() hook is a game changer for data fetching.',
        forumId: forum2.id,
        userId: user3.id,
      },
      {
        content: 'I built a full-stack app with Next.js and Supabase. Happy to share the code!',
        forumId: forum3.id,
        userId: user2.id,
      },
      {
        content: 'That sounds awesome! Would love to see how you implemented authentication.',
        forumId: forum3.id,
        userId: user1.id,
      },
      {
        content: 'How do I deploy a Next.js app to Vercel with a custom domain?',
        forumId: forum4.id,
        userId: user3.id,
      },
      {
        content: 'You can add your custom domain in the Vercel dashboard under your project settings.',
        forumId: forum4.id,
        userId: user2.id,
      },
      {
        content: 'Make sure to update your DNS settings to point to Vercel as well!',
        forumId: forum4.id,
        userId: user1.id,
      },
    ],
  })

  console.log('✅ Seed completed successfully!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.forum.count()} forums`)
  console.log(`Created ${await prisma.comment.count()} comments`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 