"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  href?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function CTAButton({
  children,
  onClick,
  className,
  type = "button",
  href,
  size = "md",
  disabled = false,
}: CTAButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center rounded-full font-semibold",
    "bg-accent text-dark transition-all duration-300",
    "hover:bg-accent-dark hover:shadow-glow-lg",
    "active:scale-95",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
    size === "sm" && "px-4 py-2 text-sm",
    size === "md" && "px-6 py-3 text-base",
    size === "lg" && "px-8 py-4 text-lg",
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses} disabled={disabled}>
      {children}
    </button>
  );
}
