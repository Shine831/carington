"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminEmail(type: "booking" | "contact", data: any) {
  if (!process.env.RESEND_API_KEY) {
    console.log("⚠️ [Email System] RESEND_API_KEY non configurée. L'email n'a pas été envoyé.");
    console.log("Données reçues :", data);
    return { success: false, error: "Missing API Key" };
  }

  // L'adresse de l'administrateur (à configurer par le client)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@e-jarnauld.com"; 

  try {
    let subject = "";
    let htmlContent = "";

    if (type === "booking") {
      subject = `[NOUVEAU DEVIS] Demande de ${data.entity}`;
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a;">
          <h2 style="color: #ee1c25;">Nouvelle demande de service</h2>
          <p><strong>Client / Entité :</strong> ${data.entity} (${data.clientType})</p>
          <p><strong>Service :</strong> ${data.serviceId}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Téléphone :</strong> ${data.phone}</p>
          <p><strong>Budget :</strong> ${data.budget}</p>
          <p><strong>Délai :</strong> ${data.timeframe}</p>
          <p><strong>Description :</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #ee1c25;">
            ${data.description}
          </div>
          <br/>
          <p style="font-size: 12px; color: #666;">Ce message a été envoyé automatiquement depuis la plateforme E-Jarnauld Soft.</p>
        </div>
      `;
    } else if (type === "contact") {
      subject = `[CONTACT] ${data.subject} - De ${data.name}`;
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a;">
          <h2 style="color: #ee1c25;">Nouveau Message de Contact</h2>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Message :</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #ee1c25;">
            ${data.message}
          </div>
          <br/>
          <p style="font-size: 12px; color: #666;">Ce message a été envoyé automatiquement depuis la plateforme E-Jarnauld Soft.</p>
        </div>
      `;
    }

    const res = await resend.emails.send({
      from: "E-Jarnauld Soft <onboarding@resend.dev>", // Utilisez votre nom de domaine vérifié en prod
      to: [ADMIN_EMAIL],
      subject,
      html: htmlContent,
    });

    console.log("Email envoyé avec succès :", res);
    return { success: true };
  } catch (error) {
    console.error("Erreur d'envoi d'email :", error);
    return { success: false, error: String(error) };
  }
}
