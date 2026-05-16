"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#doctores", label: "Doctores" },
  { href: "#contacto", label: "Contacto", openForm: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openForm = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-dark/80 backdrop-blur-xl border-b border-glass-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-white font-heading text-xl sm:text-2xl font-bold tracking-tight"
          >
            <span className="text-accent">✦</span>
            Ora Nova
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={link.openForm ? openForm : undefined}
                className="text-sm text-text-secondary hover:text-accent transition-colors duration-300 font-medium tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={openForm}
              className="px-5 py-2.5 rounded-full bg-accent text-dark text-sm font-semibold hover:shadow-glow transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Agendar Cita
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-glass transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-glass-border bg-dark/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={link.openForm ? openForm : (e) => { e.preventDefault(); setIsOpen(false); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block text-text-secondary hover:text-accent transition-colors duration-300 py-2 text-lg font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={openForm}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="block w-full text-center px-5 py-3 rounded-full bg-accent text-dark font-semibold hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                Agendar Cita
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
