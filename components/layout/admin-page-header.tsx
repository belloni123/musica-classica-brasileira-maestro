export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold leading-tight text-[var(--foreground-strong)]">{title}</h1>
        {description ? <p className="mt-2 text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
