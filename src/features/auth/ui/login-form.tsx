"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "../schemas/login.schema";

interface LoginFormProps {
  onValidationError?: () => void;
  onSuccess?: () => void;
}

interface FormFieldErrors {
  email: string | null;
  password: string | null;
}

export function LoginForm({ onValidationError, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({
    email: null,
    password: null,
  });

  const handleInputChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }

    if (fieldErrors[field] || globalError) {
      setFieldErrors((prev: FormFieldErrors) => ({
        ...prev,
        [field]: null,
      }));
      setGlobalError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);
    setGlobalSuccess(null);

    const validationResult = loginSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!validationResult.success) {
      const formattedErrors: FormFieldErrors = {
        email: null,
        password: null,
      };

      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === "email" && !formattedErrors.email) {
          formattedErrors.email = issue.message;
        }
        if (path === "password" && !formattedErrors.password) {
          formattedErrors.password = issue.message;
        }
      });

      setFieldErrors(formattedErrors);
      onValidationError?.();
      return;
    }

    setFieldErrors({ email: null, password: null });
    setIsSubmitting(true);

    try {
      // UI demo flow: simulates authentication submission
      await new Promise<void>((resolve: () => void) => {
        window.setTimeout(() => resolve(), 900);
      });

      setGlobalSuccess("Sesión iniciada correctamente. Redirigiendo al panel...");
      onSuccess?.();

      window.setTimeout(() => {
        router.push("/");
      }, 800);
    } catch {
      setGlobalError("Credenciales inválidas o problema de conexión.");
      onValidationError?.();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto text-[#ebe8f7]">
      <div className="mb-7">
        <h1 className="font-['Chakra_Petch',sans-serif] text-3xl sm:text-[34px] font-bold text-white tracking-wide">
          Entra a Tekna
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#a8a3c4]">
          Usa tu cuenta para ver y mover el inventario.
        </p>
      </div>

      {globalError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-[#ff7a88]/40 bg-[#ff7a88]/10 p-3.5 text-sm text-[#ff7a88]"
        >
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <span>{globalError}</span>
        </div>
      )}

      {globalSuccess && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-[#5ce3a1]/40 bg-[#5ce3a1]/10 p-3.5 text-sm text-[#5ce3a1]"
        >
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <span>{globalSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#ebe8f7] mb-1.5"
          >
            Correo
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("email", e.target.value)
              }
              aria-invalid={Boolean(fieldErrors.email)}
              placeholder="nombre@teknagamer.pe"
              className={`
                w-full h-12 px-3.5 rounded-xl text-base text-[#ebe8f7] placeholder-[#a8a3c4]/50
                bg-[#100c22] border transition-colors duration-150 outline-none
                ${
                  fieldErrors.email
                    ? "border-[#ff7a88] focus:border-[#ff7a88] focus:ring-2 focus:ring-[#ff7a88]/30"
                    : "border-[#2e2750] hover:border-[#43397a] focus:border-[#2ee6d6] focus:ring-2 focus:ring-[#2ee6d6]/20"
                }
              `}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-[#ff7a88]" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#ebe8f7] mb-1.5"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("password", e.target.value)
              }
              aria-invalid={Boolean(fieldErrors.password)}
              placeholder="••••••••••••"
              className={`
                w-full h-12 pl-3.5 pr-24 rounded-xl text-base text-[#ebe8f7] placeholder-[#a8a3c4]/50
                bg-[#100c22] border transition-colors duration-150 outline-none
                ${
                  fieldErrors.password
                    ? "border-[#ff7a88] focus:border-[#ff7a88] focus:ring-2 focus:ring-[#ff7a88]/30"
                    : "border-[#2e2750] hover:border-[#43397a] focus:border-[#2ee6d6] focus:ring-2 focus:ring-[#2ee6d6]/20"
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev: boolean) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium text-[#a8a3c4] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <>
                  <EyeOff className="size-3.5" />
                  <span>Ocultar</span>
                </>
              ) : (
                <>
                  <Eye className="size-3.5" />
                  <span>Mostrar</span>
                </>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-[#ff7a88]" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRememberMe(e.target.checked)
            }
            className="size-4.5 rounded border-[#2e2750] bg-[#100c22] text-[#2ee6d6] accent-[#2ee6d6] focus:ring-[#2ee6d6] cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-[#a8a3c4] hover:text-[#ebe8f7] cursor-pointer select-none"
          >
            Mantener la sesión en este equipo
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full h-[50px] mt-2 rounded-xl
            bg-[#2ee6d6] text-[#0d0a18]
            font-['Chakra_Petch',sans-serif] font-bold text-base sm:text-[17px] tracking-wide
            shadow-[0_4px_0_#14998f]
            hover:brightness-110 active:translate-y-[3px] active:shadow-[0_1px_0_#14998f]
            disabled:opacity-60 disabled:cursor-wait
            transition-all duration-100 ease-out
            flex items-center justify-center gap-2 cursor-pointer
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <span>Iniciar sesión</span>
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href="/forgot-password"
          className="text-[#2ee6d6] hover:text-white underline-offset-4 hover:underline transition-colors"
        >
          Olvidé mi contraseña
        </Link>
        <Link
          href="/register"
          className="text-[#2ee6d6] hover:text-white underline-offset-4 hover:underline transition-colors"
        >
          Crear una cuenta
        </Link>
      </div>
    </div>
  );
}
