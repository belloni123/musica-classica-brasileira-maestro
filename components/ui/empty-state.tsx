import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] shadow-[var(--button-inset)]">
        <Inbox size={20} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-normal">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </Card>
  );
}
