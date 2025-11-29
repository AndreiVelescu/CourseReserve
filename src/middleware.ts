// middleware.ts
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { HttpErrorLog, UserRole } from "@prisma/client";
import { routing } from "./i18n/routing";

const getPreferredLocale = (req: NextRequest) => {
  const cookieLocale = req.cookies.get("NEXT_LOCALE");
  if (
    cookieLocale &&
    routing.locales.includes(cookieLocale.value as "en" | "ro" | "ru")
  ) {
    return cookieLocale.value;
  }
  return routing.defaultLocale;
};

const getClientIP = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0].trim() : "::1";
  if (ip === "::1") ip = "127.0.0.1";
  return ip;
};

const logHttp = async (data: any, origin: string) => {
  try {
    // Trimite log către endpoint intern Node.js

    await fetch(`${origin}/api/log-http`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("HTTP log sent successfully");
  } catch (err) {
    console.error("Failed to send HTTP log:", err);
  }
};

export default withAuth(
  async function middleware(req) {
    const { pathname, search } = req.nextUrl;
    const sessionToken = req.nextauth.token;
    const locale = getPreferredLocale(req);
    const redirectUrl = (path: string) => new URL(`${path}${search}`, req.url);
    const ip = getClientIP(req);
    const userAgent = req.headers.get("user-agent") || "";

    // Admin restriction
    if (pathname.includes("admin") && sessionToken?.role !== UserRole.ADMIN) {
      await logHttp(
        {
          statusCode: 403,
          method: "GET",
          url: pathname,
          ipAddress: ip,
          message: "Unauthorized access to admin",
          userAgent,
        },
        req.nextUrl.origin,
      );
      return NextResponse.redirect(redirectUrl(`/${locale}/`));
    }

    // Profile restriction
    if (pathname === `/${locale}/profile` && !sessionToken) {
      await logHttp(
        {
          statusCode: 401,
          method: "GET",
          url: pathname,
          ipAddress: ip,
          message: "Unauthorized access to profile",
          userAgent,
        },
        req.nextUrl.origin,
      );
      return NextResponse.redirect(redirectUrl(`/${locale}/`));
    }

    // Routes without locale prefix
    const pathWithoutLocale = /^\/(?!en|ro|ru)(.*)$/.exec(pathname);
    if (pathWithoutLocale) {
      return NextResponse.redirect(
        redirectUrl(`/${locale}/${pathWithoutLocale[1]}`),
      );
    }

    const handlei18Routing = createMiddleware(routing);
    return handlei18Routing(req);
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/courses",
    "/courses/:path*",
    "/admin/:path*",
    "/profile",
    "/settings",
    "/(en|ro|ru)/:path*",
  ],
};
