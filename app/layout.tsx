import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { publicEnv } from "@/lib/env";
import "@fontsource-variable/jost/wght.css";
import "@fontsource-variable/bodoni-moda/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://obras.maestrothiagosantos.com.br"),
  title: "Brasil Orquestral",
  description:
    "Brasil Orquestral: plataforma de catalogação, pesquisa e difusão da música brasileira de concerto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
