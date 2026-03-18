import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@gmail.com";
  const hashedPassword = await bcrypt.hash("admin", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrateur",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    // Use standard error handling without explicit process.exit if types are missing, 
    // or just rely on the throw.
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
