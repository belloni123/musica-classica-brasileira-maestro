import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-md border px-2 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function publicationStatusTone(status?: string | null): BadgeTone {
  if (status === "published") {
    return "success";
  }

  if (status === "in_review") {
    return "info";
  }

  if (status === "archived") {
    return "danger";
  }

  return "warning";
}

export function publicationStatusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    in_review: "Em revisão",
    published: "Publicado",
    archived: "Arquivado",
  };

  return labels[status ?? ""] ?? status ?? "Sem status";
}
