import logoMark from "@/assets/logo-mark.png.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoMark.url}
        alt="Paras Arts"
        width={44}
        height={44}
        className="h-11 w-11 rounded-md object-contain drop-shadow-[0_0_20px_rgba(201,138,43,0.35)]"
      />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.18em] text-gold-gradient">
            PARAS ARTS
          </span>
          <span className="mt-1 text-[10px] tracking-[0.3em] text-muted-foreground">
            WHERE EVERY FRAME REMEMBERS
          </span>
        </div>
      )}
    </div>
  );
}
