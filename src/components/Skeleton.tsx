type Props = { className?: string };

/** Shimmering placeholder block used while content loads. */
export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white/[0.04] ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,194,122,0.10), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

/** Card-shaped skeleton matching the artwork grid. */
export function ArtworkSkeleton() {
  return (
    <div className="card-luxe overflow-hidden">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}
