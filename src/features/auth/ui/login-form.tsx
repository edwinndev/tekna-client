"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema } from "../schemas/login.schema";
import { useAuth } from "../hooks/use-auth";
import { LoginFormValues } from "../types/auth";

interface LoginFormProps {
  onValidationError?: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onValidationError, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }: { value: LoginFormValues }) => {
      setGlobalError(null);
      setGlobalSuccess(null);

      const validation = loginSchema.safeParse(value);
      if (!validation.success) {
        onValidationError?.();
        return;
      }

      try {
        await login(
          {
            username: value.username,
            password: value.password,
          },
          value.rememberMe
        );

        setGlobalSuccess("Sesión iniciada correctamente. Redirigiendo al panel...");
        onSuccess?.();

        window.setTimeout(() => {
          router.push("/");
        }, 800);
      } catch {
        setGlobalError("Credenciales inválidas o problema de conexión.");
        onValidationError?.();
      }
    },
  });

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
        <Alert
          variant="destructive"
          className="mb-5 border-[#ff7a88]/40 bg-[#ff7a88]/10 text-[#ff7a88] rounded-xl"
        >
          <AlertCircle className="size-4 shrink-0 text-[#ff7a88]" />
          <AlertDescription className="text-sm font-medium text-[#ff7a88]">
            {globalError}
          </AlertDescription>
        </Alert>
      )}

      {globalSuccess && (
        <Alert className="mb-5 border-[#5ce3a1]/40 bg-[#5ce3a1]/10 text-[#5ce3a1] rounded-xl">
          <CheckCircle2 className="size-4 shrink-0 text-[#5ce3a1]" />
          <AlertDescription className="text-sm font-medium text-[#5ce3a1]">
            {globalSuccess}
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
        className="space-y-5"
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }: { value: string }) => {
              const res = loginSchema.shape.username.safeParse(value);
              return res.success ? null : res.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const hasError = Boolean(field.state.meta.errors.length > 0);
            const errorMessage = field.state.meta.errors[0]
              ? String(field.state.meta.errors[0])
              : null;

            return (
              <Field data-invalid={hasError} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-[#ebe8f7]"
                >
                  Correo
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  inputMode="email"
                  autoComplete="username email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.handleChange(e.target.value);
                    if (globalError) {
                      setGlobalError(null);
                    }
                  }}
                  aria-invalid={hasError}
                  placeholder="admin@teknagamer.pe"
                  className={`
                    w-full h-12 px-3.5 rounded-xl text-base text-[#ebe8f7] placeholder-[#a8a3c4]/50
                    bg-[#100c22] border transition-colors duration-150 outline-none
                    ${
                      hasError
                        ? "border-[#ff7a88] focus-visible:border-[#ff7a88] focus-visible:ring-[#ff7a88]/30"
                        : "border-[#2e2750] hover:border-[#43397a] focus-visible:border-[#2ee6d6] focus-visible:ring-[#2ee6d6]/20"
                    }
                  `}
                />
                {errorMessage && (
                  <FieldError className="text-xs text-[#ff7a88]">
                    {errorMessage}
                  </FieldError>
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }: { value: string }) => {
              const res = loginSchema.shape.password.safeParse(value);
              return res.success ? null : res.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const hasError = Boolean(field.state.meta.errors.length > 0);
            const errorMessage = field.state.meta.errors[0]
              ? String(field.state.meta.errors[0])
              : null;

            return (
              <Field data-invalid={hasError} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium text-[#ebe8f7]"
                >
                  Contraseña
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.handleChange(e.target.value);
                      if (globalError) {
                        setGlobalError(null);
                      }
                    }}
                    aria-invalid={hasError}
                    placeholder="••••••••••••"
                    className={`
                      w-full h-12 pl-3.5 pr-24 rounded-xl text-base text-[#ebe8f7] placeholder-[#a8a3c4]/50
                      bg-[#100c22] border transition-colors duration-150 outline-none
                      ${
                        hasError
                          ? "border-[#ff7a88] focus-visible:border-[#ff7a88] focus-visible:ring-[#ff7a88]/30"
                          : "border-[#2e2750] hover:border-[#43397a] focus-visible:border-[#2ee6d6] focus-visible:ring-[#2ee6d6]/20"
                      }
                    `}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((prev: boolean) => !prev)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium text-[#a8a3c4] hover:text-white hover:bg-white/5 cursor-pointer"
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
                  </Button>
                </div>
                {errorMessage && (
                  <FieldError className="text-xs text-[#ff7a88]">
                    {errorMessage}
                  </FieldError>
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="rememberMe">
          {(field) => (
            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked: boolean) =>
                  field.handleChange(checked)
                }
                className="size-4.5 rounded border-[#2e2750] bg-[#100c22] text-[#2ee6d6] data-checked:bg-[#2ee6d6] data-checked:border-[#2ee6d6] data-checked:text-[#0d0a18] cursor-pointer"
              />
              <FieldLabel
                htmlFor={field.name}
                className="text-sm text-[#a8a3c4] hover:text-[#ebe8f7] cursor-pointer select-none font-normal"
              >
                Mantener la sesión en este equipo
              </FieldLabel>
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting]) => (
            <Button
              type="submit"
              disabled={Boolean(isSubmitting)}
              className="
                w-full h-[50px] mt-2 rounded-xl
                bg-[#2ee6d6] hover:bg-[#25d8c7] text-[#0d0a18] hover:text-[#0d0a18]
                font-['Chakra_Petch',sans-serif] font-bold text-base sm:text-[17px] tracking-wide
                shadow-none hover:shadow-none active:translate-y-0
                disabled:opacity-60 disabled:cursor-wait
                transition-colors duration-150 ease-out
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
            </Button>
          )}
        </form.Subscribe>
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
