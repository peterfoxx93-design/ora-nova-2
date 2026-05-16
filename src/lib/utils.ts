import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Mexican Peso currency string.
 * Example: 12500 → "$12,500.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a phone number for WhatsApp link.
 * Removes non-digit characters and prepends country code.
 */
export function formatWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `52${digits}`;
}
