"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Smile, Gem, Sparkles, Scan } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

const specialties = [
  {
    title: "Ortodoncia Invisible",
    description:
      "Alineadores transparentes personalizados que corrigen la posición dental sin brackets. Discreto, cómodo y altamente efectivo.",
    icon: Smile,
    image: "/images/procedure-ortho.jpg",
    size: "tall" as const,
  },
  {
    title: "Coronas de Zirconio",
    description:
      "Restauraciones de alta estética con la resistencia del zirconio. Una solución definitiva para dientes dañados con apariencia natural.",
    icon: Gem,
    image: "/images/procedure-crown.jpg",
    size: "wide" as const,
  },
  {
    title: "Carillas de Porcelana",
    description:
      "Láminas ultrafinas que transforman tu sonrisa en una obra de arte. Corrigen color, forma y alineación en solo dos visitas.",
    icon: Sparkles,
    image: "/images/procedure-veneer.jpg",
    size: "wide" as const,
  },
  {
    title: "Implantes de Titanio",
    description:
      "La solución más avanzada para reemplazar dientes perdidos. Titanio de grado quirúrgico con resultados permanentes y naturales.",
    icon: Scan,
    image: "/images/procedure-implant.jpg",
    size: "tall" as const,
  },
];

export default function Specialties() {
  return (
    <section id="especialidades" className="relative py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Especialidades
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Excelencia en cada
            <br />
            <span className="text-accent">procedimiento</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Combinamos técnica avanzada con un enfoque artístico para ofrecerte
            resultados que transforman sonrisas y vidas.
          </p>
        </AnimatedSection>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {specialties.map((specialty, index) => (
            <AnimatedSection
              key={specialty.title}
              delay={index * 0.1}
              className={
                specialty.size === "tall"
                  ? "md:row-span-2 md:col-span-1"
                  : "md:col-span-1"
              }
            >
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group h-full min-h-[320px] sm:min-h-[380px] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={specialty.image}
                  alt={specialty.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-dark/30 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center">
                      <specialty.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                  </div>

                  {/* Title - Always visible */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                    {specialty.title}
                  </h3>

                  {/* Description - Visible on hover */}
                  <div className="overflow-hidden">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="text-text-secondary text-sm sm:text-base leading-relaxed"
                    >
                      {specialty.description}
                    </motion.p>
                  </div>
                </div>

                {/* Glass overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-glass via-glass/50 to-transparent" />
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
