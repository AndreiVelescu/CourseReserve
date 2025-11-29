import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Source_Sans_3 } from "next/font/google";

import { Layout } from "@/components/Layout";

import { LocalizationProvider } from "@/providers/localizationProvider";
import { NextAuthProvider } from "@/providers/nextAuth";
import ReactQueryProvider from "@/providers/reactQueryProvider";
import { SnackbarProvider } from "@/providers/snackbarProvider";
import theme from "@/theme";

import type { Metadata } from "next";

const inter = Inter({
  weight: ["200", "300", "400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sourceSansPro = Source_Sans_3({
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-pro",
});

export const metadata: Metadata = {
  title: "CourseReserve",
  description: "Platforma ta pentru cursuri online",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const session = await getServerSession();

  const awaitedLocale = (await params).locale;

  return (
    <html lang={awaitedLocale}>
      <CssBaseline />
      <body className={`${sourceSansPro.variable} ${inter.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider theme={theme}>
            <AppRouterCacheProvider>
              <NextAuthProvider session={session}>
                <NextIntlClientProvider messages={messages}>
                  <LocalizationProvider>
                    <SnackbarProvider>
                      <main>
                        <Layout>{children}</Layout>
                      </main>
                    </SnackbarProvider>
                  </LocalizationProvider>
                </NextIntlClientProvider>
              </NextAuthProvider>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
