import React from "react";
import Hero from "@/components/sections/Hero";
import Specialties from "@/components/sections/Specialties";
import Specialists from "@/components/sections/Specialists";
import AppointmentForm from "@/components/sections/AppointmentForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Specialties />
      <Specialists />
      <AppointmentForm />
    </>
  );
}
