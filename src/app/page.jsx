'use client'

import { RegistrationPortal } from "@/components/registration/RegistrationPortal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegistrationPage() {
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <RegistrationPortal />
      </main>
    </>
  );
} 
