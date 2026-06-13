"use server";

import { apiFetch } from "@/lib/api";
import { LogiNPayload, LoginResponse, SignUpPayload } from "@/types/auth";
import { cookies } from "next/headers";

export async function signUp(data: SignUpPayload) {
  const response = await apiFetch<LoginResponse>("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const signUpData = response.data;

  const cookieStore = await cookies();

  cookieStore.set("access_token", signUpData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: signUpData.expires_in,
  });

  cookieStore.set("refresh_token", signUpData.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: signUpData.expires_in,
  });

  return {
    ok: response.ok,
    status: response.status,
    user: signUpData.user,
  };
}

export async function logIn(data: LogiNPayload) {
  const response = await apiFetch<LoginResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const loginData = response.data;

  const cookieStore = await cookies();

  cookieStore.set("access_token", loginData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: loginData.expires_in,
  });

  cookieStore.set("refresh_token", loginData.refresh_token, {
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
    ok: response.ok,
    status: response.status,
    user: loginData.user,
  };
}

export async function forgotPassword(email: string) {
  const response = await apiFetch("/auth/v1/recover", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

export async function resetPassword(data: { password: string; accessToken: string }) {
  const response = await apiFetch("/auth/v1/user", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
    body: JSON.stringify({
      password: data.password,
    }),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

export async function getCurrentUser() {
  const response = await apiFetch<LoginResponse["user"]>("/auth/v1/user", {
    method: "GET",
    requiresAuth: true,
  });

  return response.data;
}

export async function logOut() {
  const response = await apiFetch("/auth/v1/logout", {
    method: "POST",
    requiresAuth: true,
  });

  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("remember_me");

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}
