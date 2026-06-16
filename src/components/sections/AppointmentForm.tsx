"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, CheckCircle } from "lucide-react";
import CTAButton from "@/components/shared/CTAButton";

const services = [
  "Ortodoncia Invisible",
  "Coronas de Zirconio",
  "Carillas de Porcelana",
  "Implantes de Titanio",
  "Consulta General",
  "Blanqueamiento Dental",
];

interface FormData {
  nombre: string;
  telefono: string;
  correo: string;
  fecha: string;
  hora: string;
  servicio: string;
}

const initialFormData: FormData = {
  nombre: "",
  telefono: "",
  correo: "",
  fecha: "",
  hora: "",
  servicio: "",
};

export default function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Escuchar evento desde Navbar para abrir el formulario directo
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handler);
    return () => window.removeEventListener("open-contact-modal", handler);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const webhooks = [
        "https://hook.us2.make.com/cpi7mx86y59653ga58qpfwi3j885el2a",
        "https://hook.us2.make.com/tyo1apd5sw4bed62almhmszjyl5b3mgc",
      ];
      let response: Response | null = null;
      for (const url of webhooks) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) { response = res; break; }
        } catch { continue; }
      }
      if (!response) throw new Error("Error al enviar el formulario");

      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFormData(initialFormData);
      }, 3000);
    } catch {
      setError(
        "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setIsSubmitted(false);
      setFormData(initialFormData);
      setError("");
    }
  };

  return (
    <>
      {/* Floating FAB for mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <CTAButton onClick={() => setIsOpen(true)} size="md">
          Agenda tu Cita
        </CTAButton>
      </div>

      {/* Desktop trigger */}
      <div className="hidden sm:block" id="contacto">
        <section className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">
              Contacto
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Comienza tu
              <br />
              <span className="text-accent">transformación</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-10">
              Da el primer paso hacia la sonrisa que siempre has deseado. Agenda
              una consulta y descubre el arte de la odontología estética.
            </p>
            <CTAButton onClick={() => setIsOpen(true)} size="lg">
              Abrir Formulario
            </CTAButton>
          </div>
        </section>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-glass"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              {isSubmitted ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    ¡Solicitud Enviada!
                  </h3>
                  <p className="text-text-secondary">
                    Te contactaremos pronto para confirmar tu cita.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
                      Agenda tu cita
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Completa el formulario y te contactaremos para confirmar
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-text-secondary mb-1.5"
                      >
                        Nombre Completo
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Dr. Juan Pérez"
                        className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-text-secondary mb-1.5"
                      >
                        Teléfono WhatsApp
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+1 (000) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="correo"
                        className="block text-sm font-medium text-text-secondary mb-1.5"
                      >
                        Correo Electrónico
                      </label>
                      <input
                        id="correo"
                        name="correo"
                        type="email"
                        required
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fecha"
                          className="block text-sm font-medium text-text-secondary mb-1.5"
                        >
                          Fecha
                        </label>
                        <input
                          id="fecha"
                          name="fecha"
                          type="date"
                          required
                          value={formData.fecha}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300 [color-scheme:dark]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="hora"
                          className="block text-sm font-medium text-text-secondary mb-1.5"
                        >
                          Hora
                        </label>
                        <div className="relative">
                          <input
                            id="hora"
                            name="hora"
                            type="time"
                            required
                            value={formData.hora}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300 [color-scheme:dark]"
                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="servicio"
                        className="block text-sm font-medium text-text-secondary mb-1.5"
                      >
                        Servicio de interés
                      </label>
                      <select
                        id="servicio"
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-glass border border-glass-border text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300 appearance-none"
                      >
                        <option value="" disabled>
                          Selecciona un servicio
                        </option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-surface">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}

                    <CTAButton
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                    </CTAButton>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
