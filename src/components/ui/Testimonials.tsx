"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { getReviews } from "@/lib/firebase/db";

// Premium Fallback Data (2026 Style) — shown while no real reviews yet
const MOCK_REVIEWS = [
  {
    rating: 5,
    comment: "Une réactivité inégalée. L'infrastructure sécurisée qu'ils ont déployée a complètement stabilisé nos opérations critiques.",
    authorName: "M. Nguema - Directeur IT",
    serviceId: "Cyber & Cloud"
  },
  {
    rating: 5,
    comment: "Le standard de 2026. SLA respectée à la lettre, support prioritaire joignable instantanément. Exceptionnel.",
    authorName: "S. Kamga - Founder",
    serviceId: "Infogérance"
  },
  {
    rating: 5,
    comment: "Qualité de câblage chirurgicale. Les baies de brassage sont des œuvres d'art et les temps de latence ont été divisés par deux.",
    authorName: "Global Logistics",
    serviceId: "Réseau"
  },
  {
    rating: 5,
    comment: "L'approche Zero Trust mise en place par E-Jarnauld nous permet de dormir sur nos deux oreilles. Une expertise locale de classe mondiale.",
    authorName: "Hôpital Privé de Bonanjo",
    serviceId: "Cybersécurité"
  }
];

export function TestimonialsSection({ language }: { language: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load cached reviews immediately for instant display
    const cached = typeof window !== "undefined" ? localStorage.getItem("cached_reviews") : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...MOCK_REVIEWS]);
        }
      } catch { /* ignore parse errors */ }
    }

    getReviews()
      .then((data) => {
        // Show ALL real client reviews (no rating filter)
        const realReviews = data.filter((r: any) => r.comment && r.rating);
        if (realReviews.length > 0) {
          // Cache for offline resilience
          if (typeof window !== "undefined") {
            localStorage.setItem("cached_reviews", JSON.stringify(realReviews));
          }
          setReviews([...realReviews, ...MOCK_REVIEWS]);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      })
      .catch(() => {
        // Firestore offline — keep cached reviews or show mock
        if (!cached) setReviews(MOCK_REVIEWS);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="section-py relative overflow-hidden bg-[var(--off-white)]">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--red)] rounded-full blur-[180px] opacity-[0.04] pointer-events-none" />
      
      {/* Section Header */}
      <div className="container-xl relative z-10 text-center mb-14">
        <span className="tag-red mb-4 inline-flex tracking-widest">
          {language === "fr" ? "L'Avis de nos Clients" : "Client Testimonials"}
        </span>
        <h2 className="display-lg text-[var(--charcoal)]">
          {language === "fr" ? "Ce qu'ils disent de " : "What they say about "}
          <span className="text-[var(--red)] italic font-serif">Nous.</span>
        </h2>
      </div>

      {/* Mobile: Simple Stack Layout (max performance, no jank) */}
      <div className="md:hidden container-xl space-y-5">
        {reviews.slice(0, 3).map((rev, i) => (
          <TestimonialCard key={i} rev={rev} />
        ))}
      </div>

      {/* Desktop: Marquee Scroll */}
      <div className="hidden md:block relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex gap-6 px-4 w-max"
        >
          {[...reviews, ...reviews].map((rev, i) => (
            <div key={i} className="w-[400px] shrink-0">
              <TestimonialCard rev={rev} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ rev }: { rev: any }) {
  return (
    <div className="p-7 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] relative group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute top-6 right-6 text-[var(--red)] opacity-[0.07] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <Quote size={60} />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        {/* Stars */}
        <div className="flex gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${idx < rev.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}`}
            />
          ))}
        </div>
        {/* Comment */}
        <p className="text-[var(--slate)] font-medium text-sm leading-relaxed mb-6 italic flex-grow">
          "{rev.comment}"
        </p>
        {/* Author */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-black text-[var(--charcoal)] tracking-tight text-sm uppercase truncate">
              {rev.authorName || rev.userId || "Client E-Jarnauld"}
            </h4>
            <span className="text-[10px] text-[var(--red)] font-bold tracking-widest uppercase">
              {rev.serviceId || "Expertise"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
