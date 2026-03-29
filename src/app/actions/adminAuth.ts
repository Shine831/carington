"use server";

export async function verifyAdminPin(pin: string) {
  // En production, ce code est défini via la variable d'environnement ADMIN_MASTER_PIN.
  const masterPin = process.env.ADMIN_MASTER_PIN;

  if (!masterPin) {
    console.error("⚠️ [Security] ADMIN_MASTER_PIN is not configured in environment variables.");
    return false;
  }
  
  // Simulation d'un délai réseau pour éviter le bruteforce rapide
  await new Promise((resolve) => setTimeout(resolve, 800));

  return pin === masterPin;
}
