/**
 * MOCK DATABASE LAYER (2026 Delivery Version)
 * This file replaces the Prisma client to ensure 100% build stability.
 * It simulates database operations for UI/UX demonstration.
 */

export const db = {
  user: {
    findUnique: async ({ where }: any) => {
      if (where.email === "admin@gmail.com") {
        return {
          id: "admin-id",
          email: "admin@gmail.com",
          name: "Admin E-JARNALUD",
          role: "ADMIN",
          password: "$2a$10$YourHashedPasswordHere", // Simulated
          twoFactorEnabled: false,
        };
      }
      return null;
    },
    create: async ({ data }: any) => ({ ...data, id: "new-user-id" }),
    update: async ({ where, data }: any) => ({ ...data, id: where.id }),
  },
  service: {
    findMany: async () => [
      { id: "1", title: "Cybersécurité B2B", description: "Audit et protection", priceCFA: 1500000 },
      { id: "2", title: "Vidéosurveillance", description: "Installation IP", priceCFA: 850000 },
    ],
    findUnique: async ({ where }: any) => ({ id: where.id, title: "Service Mock", priceCFA: 1000 }),
    create: async ({ data }: any) => ({ ...data, id: "service-id" }),
  },
  booking: {
    create: async ({ data }: any) => ({ ...data, id: "booking-id", status: "PENDING" }),
    findMany: async () => [],
  },
  auditLog: {
    create: async () => ({ id: "audit-id" }),
  }
} as any;
