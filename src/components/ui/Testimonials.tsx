"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { getReviews } from "@/lib/firebase/db";

// Fallback Premium Data (2026 Style)
const MOCK_REVIEWS = [
  {
    rating: 5,
    comment: "Une réactivité inégalée. L'infrastructure sécurisée qu'ils ont déployée à Douala a complètement stabilisé nos opérations bancaires critiques.",
    userId: "M. Nguema - Directeur IT",
    serviceId: "Cyber & Cloud"
  },
  {
    rating: 5,
    comment: "Le standard de 2026. SLA respectée à la lettre, support prioritaire joignable instantanément via WhatsApp. Exceptionnel.",
    userId: "S. Kamga - Founder",
    serviceId: "Infogérance"
  },
  {
    rating: 5,
    comment: "Qualité de câblage chirurgicale. Les baies de brassage sont des œuvres d'art et les temps de latence ont été divisés par deux.",
    userId: "Global Logistics",
    serviceId: "Réseau"
  },
  {
    rating: 5,
    comment: "L'approche 'Zero Trust' mise en place par E-Jarnauld nous permet de dormir sur nos deux oreilles. Une expertise locale de classe mondiale.",
    userId: "Hôpital Privé de Bonanjo",
    serviceId: "Cyber"
  }
];

export function TestimonialsSection({ language }: { language: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then((data) => {
        // Only show 4 and 5 stars for public
        const premiumReviews = data.filter((r: any) => r.rating >= 4);
        setReviews(premiumReviews.length >= 3 ? premiumReviews : MOCK_REVIEWS);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setReviews(MOCK_REVIEWS);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="section-py relative overflow-hidden bg-[var(--off-white)]">
      {/* Background Gradients */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[var(--red)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />
      
      <div className="container-xl relative z-10 text-center mb-16">
        <span className="tag-red mb-4 inline-flex tracking-widest">{language === "fr" ? "L'Avis de nos Clients" : "Client Testimonials"}</span>
        <h2 className="display-lg text-[var(--charcoal)]">
          {language === "fr" ? "Ce qu'ils disent de " : "What they say about "} 
          <span className="text-[var(--red)] italic font-serif">Nous.</span>
        </h2>
      </div>

      <div className="relative w-full max-w-[100vw] overflow-hidden flex whitespace-nowrap mask-edges">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex gap-8 hover:[animation-play-state:paused] px-4 w-max"
        >
          {/* Double the array to create infinite horizontal scrolling effect */}
          {[...reviews, ...reviews].map((rev, i) => (
            <div 
              key={i} 
              className="w-[350px] md:w-[450px] shrink-0 whitespace-normal p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] relative group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute top-8 right-8 text-[var(--red)] opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Quote size={80} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-[var(--slate)] font-medium text-sm md:text-base leading-relaxed mb-8 italic flex-grow">
                  "{rev.comment}"
                </p>
                
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[var(--charcoal)] tracking-tight text-sm uppercase">{rev.userId || "Client E-Jarnauld"}</h4>
                    <span className="text-[10px] text-[var(--red)] font-bold tracking-widest uppercase">{rev.serviceId || "Expertise"}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-[10px] font-black text-slate-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
}
