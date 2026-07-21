import { prisma } from "./src/db";

async function main() {
  const users = await prisma.user.findMany({
    include: {
      clients: true,
      invoices: true,
      quotations: true
    }
  });

  console.log("Users in DB:");
  users.forEach(u => {
    console.log(`- Email: ${u.email} | Clients: ${u.clients.length} | Invoices: ${u.invoices.length} | Quotations: ${u.quotations.length}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
