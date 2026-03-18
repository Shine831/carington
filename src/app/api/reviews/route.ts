import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const ReviewSchema = z.object({
  serviceId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedFields = ReviewSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Données d'avis invalides" }, { status: 400 });
    }

    const { serviceId, rating, comment } = validatedFields.data;

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        serviceId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la soumission de l'avis" }, { status: 500 });
  }
}
