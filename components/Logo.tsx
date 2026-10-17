import Link from "next/link";

export function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white shadow-glow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" />
        </svg>
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        Reelty
      </span>
    </Link>
  );
}
