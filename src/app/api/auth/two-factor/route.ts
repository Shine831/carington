import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog, AuditAction, AuditSeverity } from "@/lib/audit-logger";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { code } = await req.json();
    
    // 2026 Trend: Simulated high-speed verification
    // In a real app, use otplib to verify the TOTP code
    const isMockValid = code === "123456"; // Demo code

    if (isMockValid) {
      await db.user.update({
        where: { id: session.user.id },
        data: { isTwoFactorConfirmed: true },
      });

      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.MFA_VERIFY,
        status: "SUCCESS",
      });

      return NextResponse.json({ success: true });
    }

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.MFA_VERIFY,
      status: "FAILURE",
      severity: AuditSeverity.HIGH,
    });

    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
