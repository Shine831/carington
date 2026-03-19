"use server";

export async function verifyAdminPin(pin: string) {
  // En production, ce code est défini dans Vercel : ADMIN_MASTER_PIN=2026
  // Par défaut, s'il n'est pas défini, on utilise 2026.
  const masterPin = process.env.ADMIN_MASTER_PIN || "2026";
  
  // Simulation d'un délai réseau pour éviter le bruteforce rapide
  await new Promise((resolve) => setTimeout(resolve, 800));

  return pin === masterPin;
}
