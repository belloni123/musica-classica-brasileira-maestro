import { requireAdminAccess } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAccess();

  return <div className="flex flex-col gap-6 lg:flex-row">{children}</div>;
}
