"use server";

import { cookies } from "next/headers";
import type { LoginResponse } from "@/types/auth";

type ApiFetchResponse<TResponse> = {
  ok: boolean;
  status: number;
  data: TResponse;
};

type ApiFetchOptions = RequestInit & {
  requiresAuth?: boolean;
};

const ONE_MONTH = 60 * 60 * 24 * 30;

//Keep user session alive by using refresh_token when access_token expires.
async function refreshAccessToken() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;
  const rememberMe = cookieStore.get("remember_me")?.value === "true";

  if (!refreshToken) {
    return null;
  }

  const res = await apiFetch<LoginResponse>("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    requiresAuth: false,
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  cookieStore.set("access_token", res.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: res.data.expires_in,
  });

  cookieStore.set("refresh_token", res.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(rememberMe ? { maxAge: ONE_MONTH } : {}),
  });

  return res.data.access_token;
}

async function safeFetch(url: string, options: RequestInit) {
  try {
    return await fetch(url, options);
  } catch (error) {
    console.log("Network error:", error);

    throw new Error("Network error. Please check your internet connection and try again.");
  }
}

export async function apiFetch<TResponse = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiFetchResponse<TResponse>> {
  const { requiresAuth = false, ...fetchOptions } = options;

  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl) {
    throw new Error("Missing API_BASE_URL environment variable");
  }

  if (!apiKey) {
    throw new Error("Missing API_KEY environment variable");
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");
  headers.set("apikey", apiKey);

  //if endpoint needs auth and access token not exists
  //try generate new access token from refresh token
  if (requiresAuth && !accessToken) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (requiresAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await safeFetch(`${baseUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
  });

  let responseData = await response.json().catch(() => null);

  // if request fails >>>> token expired
  if (!response.ok && requiresAuth) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throw new Error("Session expired. Please log in again.");
    }

    headers.set("Authorization", `Bearer ${newAccessToken}`);

    response = await safeFetch(`${baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      cache: "no-store",
    });

    responseData = await response.json().catch(() => null);
  }

  if (!response.ok) {
    // console.log("API error status>>>>>>>>>>>>>>>>>>>", response.status);
    // console.log("API error data>>>>>>>>>>>>>>>>>>>>>>>", responseData);

    throw new Error(
      responseData?.msg || responseData?.message || responseData?.error || "Request failed"
    );
  }

  return {
    ok: response.ok,
    status: response.status,
    data: responseData as TResponse,
  };
}
