import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('Created demo user:', user.email);

  const companies = await Promise.all([
    prisma.company.upsert({
      where: { name: 'Google' },
      update: {},
      create: {
        name: 'Google',
        industry: 'Technology',
        website: 'https://google.com',
      },
    }),
    prisma.company.upsert({
      where: { name: 'Meta' },
      update: {},
      create: {
        name: 'Meta',
        industry: 'Technology',
        website: 'https://meta.com',
      },
    }),
    prisma.company.upsert({
      where: { name: 'Amazon' },
      update: {},
      create: {
        name: 'Amazon',
        industry: 'Technology',
        website: 'https://amazon.com',
      },
    }),
  ]);

  console.log('Created companies:', companies.map(c => c.name).join(', '));

  const questions = await Promise.all([
    prisma.question.create({
      data: {
        userId: user.id,
        companyId: companies[0].id,
        companyName: 'Google',
        title: 'Two Sum Problem',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        difficulty: 'EASY',
        category: 'CODING',
        tags: ['arrays', 'hash-table', 'leetcode'],
      },
    }),
    prisma.question.create({
      data: {
        userId: user.id,
        companyId: companies[0].id,
        companyName: 'Google',
        title: 'Tell me about a time you solved a difficult problem',
        description: 'Describe a situation where you faced a challenging technical or team problem. What was the problem, what did you do, and what was the outcome?',
        difficulty: 'MEDIUM',
        category: 'BEHAVIORAL',
        tags: ['leadership', 'problem-solving', 'communication'],
      },
    }),
    prisma.question.create({
      data: {
        userId: user.id,
        companyId: companies[1].id,
        companyName: 'Meta',
        title: 'Design a URL Shortener',
        description: 'Design a URL shortening service like bit.ly. Your system should be able to create short URLs from long URLs and redirect users when they visit the short URL. Consider scalability, availability, and performance.',
        difficulty: 'HARD',
        category: 'SYSTEM_DESIGN',
        tags: ['distributed-systems', 'scalability', 'design'],
      },
    }),
    prisma.question.create({
      data: {
        userId: user.id,
        companyId: companies[2].id,
        companyName: 'Amazon',
        title: 'Reverse a Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'MEDIUM',
        category: 'CODING',
        tags: ['linked-list', 'recursion', 'pointers'],
      },
    }),
  ]);

  console.log('Created questions:', questions.length);

  const collection = await prisma.collection.create({
    data: {
      userId: user.id,
      name: 'FAANG Interview Prep',
      description: 'Essential questions for preparing FAANG interviews',
      questionIds: questions.map(q => q.id),
      color: '#3B82F6',
    },
  });

  console.log('Created collection:', collection.name);

  const practiceSession = await prisma.practiceSession.create({
    data: {
      userId: user.id,
      questionId: questions[0].id,
      answer: 'I would use a hash map to store the complement of each number as I iterate through the array. For each number, I check if its complement exists in the map. If it does, I return the indices. Time complexity: O(n), Space complexity: O(n).',
      duration: 1200, // 20 minutes
      rating: 4,
      aiFeedback: {
        strengths: ['Clear explanation of approach', 'Correct time and space complexity analysis'],
        improvements: ['Could mention edge cases', 'Add example walkthrough'],
        score: 8,
        suggestions: 'Consider discussing trade-offs between different approaches.',
      },
    },
  });

  console.log('Created practice session');

  console.log('\nSeed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
