import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Música Brasileira de Concerto",
  description:
    "Plataforma de catalogação, pesquisa e difusão da música brasileira de concerto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteHeader />
        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-5 py-10 md:px-8 md:py-14">
          {children}
        </main>
      </body>
    </html>
  );
}
