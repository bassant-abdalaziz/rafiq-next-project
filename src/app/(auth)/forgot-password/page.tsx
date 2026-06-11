"use client";

import { forgotPassword } from "@/actions/auth";
import { AuthFormContent } from "@/components/auth/auth-form-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ForgotPasswordFormValues, ForgotPasswordSchema } from "@/schemas/auth";
import { getErrorMessage } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const RESET_TIMER_SECONDS = 5 * 60;
const MAX_TRIALS = 3;

export default function ForgotPasswordPage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [timer, setTimer] = useState(0);
  const [trials, setTrials] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const sendResetLink = async (email: string) => {
    await forgotPassword(email);

    setShowSuccessMessage(true);
    setTimer(RESET_TIMER_SECONDS);
    setTrials((prev) => prev + 1);
  };

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendResetLink(data.email);
    } catch (error) {
      const message = getErrorMessage(error);
    toast.error(message);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || trials >= MAX_TRIALS) return;

    try {
      const email = getValues("email");
      await sendResetLink(email);
    } catch (error) {
      const message = error instanceof Error && error.message;

      toast.error(message);
    }
  };

  const isResendDisabled = timer > 0 || trials >= MAX_TRIALS || isSubmitting;

  return (
    <AuthFormContent
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions."
      align={{ mobile: "center", desktop: "left" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isResendDisabled}
          fullWidth
          isLoading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 flex w-full items-center justify-center gap-2">
        <Image src="/images/arrow-back.svg" alt="arrow back" width={15} height={15} />

        <Link href="/login" className="font-semibold text-primary">
          Back to log in
        </Link>
      </div>

      {showSuccessMessage && (
        <div className="mt-8 md:mt-16">
          {/* Mobile UI */}
          <div className="rounded-sm  bg-[#E6F8EF] p-4 md:hidden">
            <div className="flex items-start gap-3">
              <Image src="/images/password-checked-true.svg" alt="success" width={18} height={18} />

              <p className="text-sm leading-5 text-[#005235] m-0">
                If an account exists with this email, we&apos;ve sent a password reset link.
              </p>
            </div>

            <div className="mt-4 border-t border-[#CDEDDD] pt-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[1.1px] text-[#00523599]">
                  Didn&apos;t receive email?
                </p>

                <button
                  type="button"
                  disabled={isResendDisabled}
                  onClick={handleResend}
                  className="text-xs font-bold uppercase tracking-[1.1px] text-primary disabled:cursor-not-allowed disabled:text-slate-light"
                >
                  {timer > 0 ? `Resend in ${formatTimer(timer)}` : "Resend"}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop UI */}
          <div className="hidden md:block">
            <div className="rounded-lg bg-[#E6F8EF] p-4">
              <div className="flex items-start gap-3">
                <Image
                  src="/images/password-checked-true.svg"
                  alt="success"
                  width={18}
                  height={18}
                />

                <p className="text-sm leading-5 text-[#005235]">
                  If an account exists with this email, we&apos;ve sent a password reset link.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[1.1px] text-[#434654]">
                Didn&apos;t receive the email?
              </p>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={isResendDisabled}
                onClick={handleResend}
              >
                <span className="flex items-center justify-center gap-2">
                  {timer > 0 && trials < MAX_TRIALS && (
                    <Image src="/images/clock.svg" alt="" width={18} height={18} />
                  )}

                  {timer > 0 ? `Resend in ${formatTimer(timer)}` : "Resend"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthFormContent>
  );
}
