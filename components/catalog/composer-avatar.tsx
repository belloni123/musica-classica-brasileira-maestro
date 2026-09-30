type ComposerAvatarProps = {
  name: string;
  src?: string | null;
  className?: string;
};

export function ComposerAvatar({ name, src, className = "" }: ComposerAvatarProps) {
  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={`Foto de ${name}`} className="h-full w-full object-cover" src={src} />
      ) : (
        <svg aria-label={`Avatar padrão de ${name}`} className="h-1/2 w-1/2" fill="none" role="img" viewBox="0 0 64 64">
          <circle cx="32" cy="23" r="10" stroke="currentColor" strokeWidth="2.5" />
          <path d="M13 55c0-11 8.5-19 19-19s19 8 19 19" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      )}
    </div>
  );
}
