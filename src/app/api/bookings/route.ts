import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { BookingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedFields = BookingSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Données de réservation invalides" }, { status: 400 });
    }

    const { serviceId } = validatedFields.data;

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        serviceId,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("BOOKING_ERROR", error);
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 });
  }
}
