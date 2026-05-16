"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section" | "article";
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = false,
  as: Component = "div",
  onClick,
}: GlassCardProps) {
  return (
    <Component
      onClick={onClick}
      className={cn(
        "glass transition-all duration-500",
        hover && "cursor-pointer hover:bg-glass-hover hover:border-glass-border-hover hover:-translate-y-1 hover:shadow-glow",
        className
      )}
    >
      {children}
    </Component>
  );
}
