import { NextRequest, NextResponse } from "next/server";
import type { LoginResponse } from "@/types/auth";

const ONE_MONTH = 60 * 60 * 24 * 30;

async function refreshAccessTokenInProxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const rememberMe = request.cookies.get("remember_me")?.value === "true";

  if (!refreshToken) {
    return null;
  }

  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as LoginResponse | null;

    if (!response.ok || !data?.access_token) {
      return null;
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      rememberMe,
    };
  } catch (error) {
    console.error("Failed to refresh access token in proxy:", error);
    return null;
  }
}

function setAuthCookies(
  response: NextResponse,
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    rememberMe: boolean;
  }
) {
  response.cookies.set("access_token", session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.expiresIn,
  });

  response.cookies.set("refresh_token", session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(session.rememberMe ? { maxAge: ONE_MONTH } : {}),
  });

  return response;
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("remember_me");

  return response;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  const authPages = ["/login", "/sign-up", "/forgot-password", "/reset-password"];

  const isHomePage = pathname === "/";
  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage = pathname === "/project" || pathname.startsWith("/project/");

  /**

* When the user opens /

* If they have an access_token, go to project

* If there is no access_token, try refresh_token

* If refresh is successful, go to project

* If it fails, go to login

*/
  if (isHomePage) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/project", request.url));
    }

    const refreshedSession = await refreshAccessTokenInProxy(request);

    if (refreshedSession) {
      const response = NextResponse.redirect(new URL("/project", request.url));
      return setAuthCookies(response, refreshedSession);
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**

* If you're inside a project and there's no access_token

* Try extracting the access_token from the refresh_token

*/
  if (!accessToken && isProtectedPage) {
    const refreshedSession = await refreshAccessTokenInProxy(request);

    if (refreshedSession) {
      const response = NextResponse.next();
      return setAuthCookies(response, refreshedSession);
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    return clearAuthCookies(response);
  }

  /**

* If the user logs in and opens login/sign-up/forgot-password

* We redirect it to the project

*/
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/project", request.url));
  }

  /**

* If there's no access_token but there is a refresh_token

* And the user logs in, for example

* We try refreshing it and redirect it to the project

*/
  if (!accessToken && isAuthPage) {
    const refreshedSession = await refreshAccessTokenInProxy(request);

    if (refreshedSession) {
      const response = NextResponse.redirect(new URL("/project", request.url));
      return setAuthCookies(response, refreshedSession);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/project/:path*", "/login", "/sign-up", "/forgot-password", "/reset-password"],
};
