import { useState } from "react";
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
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#0e0e0e] ${ratio} ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full transition-[transform,opacity] duration-[1.2s] ease-out ${
          fit === "contain" ? "object-contain p-2" : "object-cover"
        } ${zoom ? "group-hover:scale-[1.07]" : ""} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
