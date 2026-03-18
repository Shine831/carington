import { db } from "@/lib/db";

export enum AuditAction {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  MFA_ENABLE = "MFA_ENABLE",
  MFA_VERIFY = "MFA_VERIFY",
  ROLE_CHANGE = "ROLE_CHANGE",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum AuditSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export async function createAuditLog({
  userId,
  action,
  status,
  severity = AuditSeverity.LOW,
  ipAddress,
  userAgent,
  details,
}: {
  userId?: string;
  action: AuditAction;
  status: "SUCCESS" | "FAILURE";
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId,
        action,
        status,
        severity,
        ipAddress,
        userAgent,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
  } catch (error) {
    console.error("AUDIT_LOG_ERROR", error);
    // Fallback to console if DB fails
  }
}
