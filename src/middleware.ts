import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "@prisma/client";
import { routing } from "./i18n/routing";

const getPreferredLocale = (req: NextRequest) => {
  const cookieLocale = req.cookies.get("NEXT_LOCALE");
  if (
    cookieLocale &&
    routing.locales.includes(cookieLocale.value as "en" | "ro" | "ru")
  ) {
    return cookieLocale.value;
  }
  // Default to 'en' if no locale is found in cookies or if it's invalid
  return routing.defaultLocale;
};

export default withAuth(
  async function middleware(req) {
    const { pathname, search } = req.nextUrl;
    const sessionToken = req.nextauth.token;

    // Preserve search parameters in redirected URLs
    const redirectUrl = (path: string) => new URL(`${path}${search}`, req.url);
    const locale = getPreferredLocale(req);

    if (pathname.includes("admin") && sessionToken?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(redirectUrl(`/${locale}/`));
    }

    if (pathname === `/${locale}/profile` && !sessionToken) {
      return NextResponse.redirect(redirectUrl(`/${locale}/`));
    }

    // Handle routes that don't have a locale prefix
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
        // Return true so that the middleware function above is always called.
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
