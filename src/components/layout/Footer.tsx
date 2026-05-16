import React from "react";

const quickLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#especialidades", label: "Especialidades" },
  { href: "#doctores", label: "Doctores" },
  { href: "#contacto", label: "Contacto" },
];

const services = [
  { href: "#especialidades", label: "Ortodoncia Invisible" },
  { href: "#especialidades", label: "Coronas de Zirconio" },
  { href: "#especialidades", label: "Carillas de Porcelana" },
  { href: "#especialidades", label: "Implantes de Titanio" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="#hero"
              className="inline-flex items-center gap-2 text-white font-heading text-2xl font-bold mb-4"
            >
              <span className="text-accent">✦</span>
              Ora Nova
            </a>
            <p className="text-text-secondary text-sm leading-relaxed">
              Donde la ciencia se encuentra con el arte. Odontología estética de
              precisión en un entorno diseñado para tu bienestar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Enlaces
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Servicios
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>Av. Reforma 250, Col. Juárez</li>
              <li>CDMX, México</li>
              <li>
                <a
                  href="tel:+525512345678"
                  className="hover:text-accent transition-colors duration-300"
                >
                  +52 (55) 1234-5678
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@oranova.mx"
                  className="hover:text-accent transition-colors duration-300"
                >
                  info@oranova.mx
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Ora Nova Dental Clinic. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-text-secondary hover:text-accent transition-colors duration-300"
            >
              Aviso de Privacidad
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-accent transition-colors duration-300"
            >
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
