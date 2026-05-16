"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import CTAButton from "@/components/shared/CTAButton";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Ora Nova Dental Clinic"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/60 to-dark/90" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-accent font-medium tracking-[0.3em] uppercase text-sm sm:text-base mb-4 sm:mb-6"
        >
          Odontología Estética de Precisión
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 sm:mb-8"
        >
          Artistry in
          <br />
          <span className="text-accent">Dentistry</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
        >
          Donde la ciencia se encuentra con el arte. Transformamos sonrisas con
          tecnología de vanguardia y un enfoque humano y personalizado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CTAButton href="#contacto" size="lg">
            Agendar Cita
          </CTAButton>
        </motion.div>

        {/* Floating Glass Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="glass px-6 py-3 flex items-center gap-3 animate-float">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-text-secondary tracking-wider uppercase">
              Agenda tu consulta hoy
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-glass-border flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
