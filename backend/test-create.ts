import { prisma } from './src/lib/prisma.js';

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user');
    return;
  }
  console.log('User found:', user.email);

  try {
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        category: 'Food',
        limitAmount: 100,
        month: 4,
        year: 2026,
      }
    });
    console.log('Budget created:', budget);
  } catch (err) {
    console.error('Budget error:', err);
  }
}
main();
