"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth";
import { signUp } from "@/actions/auth";
import { SignUpPayload } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PasswordRules } from "@/components/ui/password-rules";
import { useState } from "react";
import { toast } from "sonner";
import { AuthFormContent } from "@/components/auth/auth-form-content";
import { getErrorMessage } from "@/utils/helpers";
import EyeIcon from "@/assets/icons/eye.svg";
import EyeOffIcon from "@/assets/icons/eye-off.svg";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const passwordRules = [
    {
      label: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "One uppercase, lowercase, and digit",
      isValid: /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
    },
    {
      label: "One special character",
      isValid: /[!@#$_%^&*]/.test(password),
    },
  ];

  const onSubmit = async (data: SignUpFormValues) => {
    const payload: SignUpPayload = {
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
        department: data.department || null,
      },
    };

    try {
      const res = await signUp(payload);

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
      title="Create your workspace"
      subtitle="Join the editorial approach to task management."
      align={{ desktop: "center", mobile: "left" }}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Enter your full name"
          helperText="3-50 characters, letters only."
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="department"
          label="Job Title (Optional)"
          type="text"
          placeholder="e.g. Frontend"
          error={errors.department?.message}
          {...register("department")}
        />

        <div className="grid gap-6 md:grid-cols-2">
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

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <PasswordRules rules={passwordRules} />

        <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
    </AuthFormContent>
  );
}
