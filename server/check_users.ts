import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users in MongoDB.`);
  if (users.length > 0) {
    console.log("User emails:", users.map(u => u.email).join(", "));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
