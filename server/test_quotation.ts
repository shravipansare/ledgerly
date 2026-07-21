import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    const client = await prisma.client.findFirst();
    if (!user || !client) {
        console.log("No user or client found");
        return;
    }
    const q = await prisma.quotation.create({
        data: {
          userId: user.id,
          clientId: client.id,
          quotationNumber: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
          issueDate: new Date(),
          validUntil: new Date(),
          subtotal: 100,
          taxTotal: 0,
          total: 100,
          status: "DRAFT",
          items: {
            create: [
              {
                description: "Test",
                quantity: 1,
                unitPrice: 100,
                total: 100
              }
            ]
          }
        }
      });
      console.log("Success:", q.id);
  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
