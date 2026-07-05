import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]",
  success: "border-[color-mix(in_srgb,var(--moss)_30%,transparent)] bg-[color-mix(in_srgb,var(--moss)_10%,transparent)] text-[var(--moss)]",
  warning: "border-[color-mix(in_srgb,#9d6b1f_32%,transparent)] bg-[color-mix(in_srgb,#9d6b1f_10%,transparent)] text-[#74501b]",
  danger: "border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]",
  info: "border-[color-mix(in_srgb,#36536d_30%,transparent)] bg-[color-mix(in_srgb,#36536d_10%,transparent)] text-[#36536d]",
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
        "inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-normal",
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
