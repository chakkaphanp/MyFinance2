import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// User data to migrate
const usersData = [
  {
    id: "cmo76f0jp0003scfk1kfpzaoo",
    email: "user1@example.com",
    name: "User One",
    password: "password123",
  },
  {
    id: "cmo75xnbf0000scfkl3iiox5g",
    email: "user2@example.com",
    name: "User Two",
    password: "password123",
  },
];

// Transaction data to migrate
const transactionsData = [
  {
    id: "cmo76gapf0005scfk9vde5819",
    userId: "cmo76f0jp0003scfk1kfpzaoo",
    type: "EXPENSE",
    category: "Food",
    amount: 208,
    description: "ข้าวเย็น MRT",
    date: new Date("2026-04-20"),
    createdAt: new Date("2026-04-20T12:34:47.472Z"),
    updatedAt: new Date("2026-04-20T12:34:47.472Z"),
  },
  {
    id: "cmo76gubh0007scfkplkzj6wq",
    userId: "cmo76f0jp0003scfk1kfpzaoo",
    type: "EXPENSE",
    category: "Food",
    amount: 90,
    description: "ข้าวกลางวัน",
    date: new Date("2026-04-20"),
    createdAt: new Date("2026-04-20T12:35:12.891Z"),
    updatedAt: new Date("2026-04-20T12:35:12.891Z"),
  },
  {
    id: "cmo774z9x0009scfkka2g017y",
    userId: "cmo76f0jp0003scfk1kfpzaoo",
    type: "EXPENSE",
    category: "Food",
    amount: 78,
    description: "ข้าวเย็นแฟน",
    date: new Date("2026-04-20"),
    createdAt: new Date("2026-04-20T12:53:59.059Z"),
    updatedAt: new Date("2026-04-20T12:53:59.059Z"),
  },
  {
    id: "cmo8hlvno0001o25dxe78gtpd",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Food",
    amount: 50,
    description: "Suki",
    date: new Date("2026-04-21"),
    createdAt: new Date("2026-04-21T10:34:49.86Z"),
    updatedAt: new Date("2026-04-21T10:34:49.86Z"),
  },
  {
    id: "cmo8hm53p0003o25d5qh9hg0w",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Food",
    amount: 59,
    description: "Yoguruto",
    date: new Date("2026-04-21"),
    createdAt: new Date("2026-04-21T10:35:02.102Z"),
    updatedAt: new Date("2026-04-21T10:35:02.102Z"),
  },
  {
    id: "cmoa1svm6000112ty5kysatkc",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Transport",
    amount: 25,
    description: "MC to CTW",
    date: new Date("2026-04-22"),
    createdAt: new Date("2026-04-22T12:47:54.893Z"),
    updatedAt: new Date("2026-04-22T12:47:54.893Z"),
  },
  {
    id: "cmoa1ta4m000312ty4qjui9xy",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Transport",
    amount: 26,
    description: "MC from CTW",
    date: new Date("2026-04-22"),
    createdAt: new Date("2026-04-22T12:48:13.701Z"),
    updatedAt: new Date("2026-04-22T12:48:13.701Z"),
  },
  {
    id: "cmoa1ucl7000512tygvzmh0ia",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Food",
    amount: 70,
    description: "ขนมไข่",
    date: new Date("2026-04-22"),
    createdAt: new Date("2026-04-22T12:49:03.546Z"),
    updatedAt: new Date("2026-04-22T12:49:03.546Z"),
  },
  {
    id: "cmocn6l0o0001l5ztj1drj1kj",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Food",
    amount: 190,
    description: "ขนมไข่",
    date: new Date("2026-04-23"),
    createdAt: new Date("2026-04-24T08:21:58.629Z"),
    updatedAt: new Date("2026-04-24T08:21:58.629Z"),
  },
  {
    id: "cmocn74s20003l5ztp3kys9u7",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Food",
    amount: 211,
    description: "เหนียวเมตตา",
    date: new Date("2026-04-23"),
    createdAt: new Date("2026-04-24T08:22:24.241Z"),
    updatedAt: new Date("2026-04-24T08:22:24.241Z"),
  },
  {
    id: "cmocw1dtt0001mijkso11v0r7",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Transport",
    amount: 231,
    description: "Taxi to MDent",
    date: new Date("2026-04-24"),
    createdAt: new Date("2026-04-24T12:29:52.576Z"),
    updatedAt: new Date("2026-04-24T12:29:52.576Z"),
  },
  {
    id: "cmocw23cd0003mijkjo3by2jc",
    userId: "cmo75xnbf0000scfkl3iiox5g",
    type: "EXPENSE",
    category: "Transport",
    amount: 300,
    description: "Rabbit top up",
    date: new Date("2026-04-24"),
    createdAt: new Date("2026-04-24T12:30:25.645Z"),
    updatedAt: new Date("2026-04-24T12:30:25.645Z"),
  },
];

async function migrateData() {
  try {
    console.log("Starting data migration...\n");

    // Step 1: Create users
    console.log("📝 Creating users...");
    for (const user of usersData) {
      try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            password: hashedPassword,
          },
        });
        console.log(`✓ Created user: ${user.email} (${user.id})`);
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(`ℹ User already exists: ${user.email}`);
        } else {
          throw error;
        }
      }
    }

    // Step 2: Migrate transactions
    console.log("\n📊 Migrating transactions...");
    for (const transaction of transactionsData) {
      await prisma.transaction.create({
        data: transaction,
      });
      console.log(`✓ Migrated transaction: ${transaction.id}`);
    }

    console.log(`\n✅ Successfully migrated ${transactionsData.length} transactions!`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
