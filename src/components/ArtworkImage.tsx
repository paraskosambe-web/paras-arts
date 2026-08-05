import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./Skeleton";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  /** Aspect ratio utility class, e.g. "aspect-[4/5]". */
  ratio?: string;
  zoom?: boolean;
  priority?: boolean;
};

/**
 * Lazy-loaded artwork image with a skeleton placeholder, letterboxed background
 * so wide subjects (cars) are never cropped in half.
 */
export function ArtworkImage({
  src,
  alt,
  className = "",
  fit = "cover",
  ratio = "aspect-[4/5]",
  zoom = true,
  priority = false,
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Images that are already complete (cached, or decoded before hydration)
  // never fire onLoad — check imperatively so they can't stay invisible.
  useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#0e0e0e] ${ratio} ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full transition-[transform,opacity] duration-[1.2s] ease-out ${
          fit === "contain" ? "object-contain p-2" : "object-cover"
        } ${zoom ? "group-hover:scale-[1.07]" : ""} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
