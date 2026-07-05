import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuthenticatedUser();

  return children;
}
