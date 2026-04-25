import { prisma } from './src/lib/prisma.js';
import jwt from 'jsonwebtoken';

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return;
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret_key_here');

  const resB = await fetch('http://localhost:3000/api/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ category: 'Transport', limitAmount: 150, month: 5, year: 2026 })
  });
  console.log('Budget:', resB.status, await resB.text());

  const resR = await fetch('http://localhost:3000/api/recurring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ type: 'EXPENSE', category: 'Transport', amount: 50, description: 'Test', frequency: 'MONTHLY', startDate: '2026-04-25' })
  });
  console.log('Recurring:', resR.status, await resR.text());
}
main();