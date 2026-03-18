import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { serviceId } = body;
    
    if (!serviceId) {
      return NextResponse.json({ error: "ID du service manquant" }, { status: 400 });
    }

    // Check if the service exists
    const serviceExists = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!serviceExists) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        serviceId,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("BOOKING_CREATE_ERROR", error);
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 });
  }
}
