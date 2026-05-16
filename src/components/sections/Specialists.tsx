"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTAButton from "@/components/shared/CTAButton";

const doctors = [
  {
    name: "Dr. Alejandro Sanz",
    specialty: "ODONTOLOGÍA & CIRUGÍA",
    image: "/images/doctor-1.jpg",
    description:
      "Especialista en cirugía oral y rehabilitación estética con más de 15 años de experiencia.",
  },
  {
    name: "Dra. Elena Rivas",
    specialty: "ORTODONCIA INVISIBLE",
    image: "/images/doctor-2.jpg",
    description:
      "Pionera en ortodoncia invisible en México. Certificada internacionalmente en Invisalign.",
  },
  {
    name: "Dr. Carlos Méndez",
    specialty: "REHABILITACIÓN ESTÉTICA",
    image: "/images/doctor-3.jpg",
    description:
      "Maestro en estética dental por la Universidad de Nueva York. Referente en carillas y coronas.",
  },
];

export default function Specialists() {
  return (
    <section id="doctores" className="relative py-20 sm:py-28 lg:py-32">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark to-dark/95 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Nuestro Equipo
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Especialistas de clase
            <br />
            <span className="text-accent">mundial</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Conoce a los profesionales que harán de tu experiencia dental algo
            excepcional.
          </p>
        </AnimatedSection>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {doctors.map((doctor, index) => (
            <AnimatedSection key={doctor.name} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group glass overflow-hidden rounded-2xl"
              >
                {/* Photo Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6 sm:p-8">
                  <p className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-2">
                    {doctor.specialty}
                  </p>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3">
                    {doctor.name}
                  </h3>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                    {doctor.description}
                  </p>
                  <CTAButton
                    href="#contacto"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Agendar Cita
                  </CTAButton>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
