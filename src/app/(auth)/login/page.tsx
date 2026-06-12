"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logIn } from "@/actions/auth";
import { LogiNPayload } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LogInSchema, type LoginFormValues } from "@/schemas/auth";
import { Checkbox } from "@/components/ui/check-box";
import { toast } from "sonner";
import { AuthFormContent } from "@/components/auth/auth-form-content";
import { getErrorMessage } from "@/utils/helpers";
import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LogInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const payload: LogiNPayload = {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    };

    try {
      const res = await logIn(payload);

      if (res.ok && res.status === 200) {
        router.push("/project");
      }
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);
    }
  };

  return (
    <AuthFormContent
      title="Welcome Back"
      subtitle="Please enter your details to access your workspace"
      align="center"
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          error={errors.password?.message}
          iconElement={
            <div onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
            </div>
          }
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="rememberMe"
            label="Remember Me"
            error={errors.rememberMe?.message}
            {...register("rememberMe")}
          />

          <Link href="/forgot-password" className="font-semibold text-sm text-primary">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          Log In
        </Button>
      </form>
    </AuthFormContent>
  );
}
