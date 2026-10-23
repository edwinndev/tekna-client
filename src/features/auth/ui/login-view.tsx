"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  InteractiveKeyboard,
  InteractiveKeyboardHandle,
} from "./interactive-keyboard";
import { LoginForm } from "./login-form";

export function LoginView() {
  const keyboardRef = useRef<InteractiveKeyboardHandle>(null);

  const handleValidationError = () => {
    keyboardRef.current?.flash("error");
  };

  const handleSuccess = () => {
    keyboardRef.current?.flash("success");
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0a18] text-[#ebe8f7] grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] overflow-x-hidden">
      {/* Hero section */}
      <section className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#14102a] border-b lg:border-b-0 lg:border-r border-[#2e2750] overflow-hidden">
        {/* Subtle gaming ambient glows */}
        <div
          className="absolute -top-32 -left-32 size-96 rounded-full bg-[#2ee6d6]/10 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 size-96 rounded-full bg-[#ff4d8d]/10 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-3 text-2xl font-bold font-['Chakra_Petch',sans-serif] tracking-wider text-white hover:opacity-95 transition-opacity"
            aria-label="Tekna Gamer, ir al inicio de sesión"
          >
            <span
              className="grid place-items-center size-9 rounded-[9px] bg-gradient-to-b from-[#272047] to-[#1b1634] shadow-[0_3px_0_#07050f,0_0_16px_rgba(46,230,214,0.45),inset_0_0_0_1px_#2ee6d6] text-white text-lg font-bold"
              aria-hidden="true"
            >
              T
            </span>
            <span>
              Tekna <span className="font-normal text-[#a8a3c4]">Gamer</span>
            </span>
          </Link>
        </div>

        {/* Center interactive mechanical keyboard display */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-center justify-center">
          <InteractiveKeyboard ref={keyboardRef} />
        </div>

        {/* Hero tagline */}
        <div className="relative z-10 hidden sm:block">
          <p className="max-w-[34ch] text-base lg:text-lg text-[#a8a3c4] leading-relaxed">
            Stock, proveedores y movimientos de tus periféricos, bajo control.
          </p>
        </div>
      </section>

      {/* Form panel section */}
      <section className="relative flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#0d0a18]">
        {/* Subtle ambient light */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-full bg-[#2ee6d6]/5 blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-[420px]">
          <LoginForm
            onValidationError={handleValidationError}
            onSuccess={handleSuccess}
          />
        </div>
      </section>
    </div>
  );
}
