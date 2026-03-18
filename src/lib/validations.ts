import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  name: z.string().min(2, { message: "Le nom est trop court" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const BookingSchema = z.object({
  serviceId: z.string().min(1, { message: "Service requis" }),
  details: z.string().optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(2, { message: "Nom requis" }),
  email: z.string().email({ message: "Email invalide" }),
  message: z.string().min(10, { message: "Message trop court" }),
});
