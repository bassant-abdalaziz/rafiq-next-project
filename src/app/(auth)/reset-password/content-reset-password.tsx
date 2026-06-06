"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { PasswordRules } from "@/components/ui/password-rules";
import { useState } from "react";
import { AuthFormLayout } from "@/components/ui/auth-form-layout";
import { toast } from "sonner";
import { type ResetPasswordFormValues, resetPasswordSchema } from "@/schemas/auth";

export default function ResetPasswordContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordRules = [
    {
      label: "8-64 characters",
      isValid: password.length >= 8 && password.length <= 64,
    },
    {
      label: "Uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "One digit",
      isValid: /[0-9]/.test(password),
    },
    {
      label: "Special character",
      isValid: /[!@#_$%^&*]/.test(password),
    },
  ];

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!accessToken) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    try {
      await resetPassword({
        accessToken,
        password: data.password,
      });

      toast.success("Your password has been updated successfully. You can now log in");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <AuthFormLayout
      title="Create a New Password"
      subtitle="Create a new, strong password to secure your workstation access."
      align={{ desktop: "left", mobile: "center" }}
      footer={
        <>
          <Link href="/login" className="font-semibold text-primary">
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          error={errors.password?.message}
          rightElement={
            <Image
              src={showPassword ? "/images/eye-off.svg" : "/images/eye.svg"}
              alt={showPassword ? "Hide password" : "Show password"}
              width={20}
              height={20}
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer"
            />
          }
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <PasswordRules rules={passwordRules} title="Security Requirements" />

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </AuthFormLayout>
  );
}
