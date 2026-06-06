"use server";

import { apiFetch } from "@/lib/api";
import { LogiNPayload, LoginResponse, SignUpPayload } from "@/types/auth";
import { cookies } from "next/headers";

export async function signUp(data: SignUpPayload) {
  return apiFetch("/auth/v1/signup", {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export async function logIn(data: LogiNPayload) {
  const res = await apiFetch<LoginResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  const cookieStore = await cookies();

  cookieStore.set("access_token", res.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: res.expires_in,
  });

  cookieStore.set("refresh_token", res.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(data.rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  cookieStore.set("remember_me", data.rememberMe ? "true" : "false", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(data.rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  return {
    user: res.user,
  };
}

export async function forgotPassword(email: string) {
  return apiFetch("/auth/v1/recover", {
    method: "POST",

    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(data: { password: string; accessToken: string }) {
  return apiFetch("/auth/v1/user", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
    body: JSON.stringify({
      password: data.password,
    }),
  });
}
