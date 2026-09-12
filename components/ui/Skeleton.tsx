export function Skeleton({ className = "w-24" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2.5 -translate-y-px rounded-full bg-rule align-middle ${className}`}
    />
  );
}
