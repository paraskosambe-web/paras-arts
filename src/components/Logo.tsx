import logoMark from "@/assets/logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoMark}
        alt="Paras Arts"
        width={34}
        height={34}
        className="h-8 w-8 shrink-0 rounded-md object-contain drop-shadow-[0_0_20px_rgba(201,138,43,0.35)] lg:h-[34px] lg:w-[34px]"
      />
      {!compact && (
        <div className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-[15px] leading-none tracking-[0.16em] text-gold-gradient lg:text-base">
            PARAS ARTS
          </span>
          <span className="mt-[3px] whitespace-nowrap text-[9px] leading-none tracking-[0.18em] text-muted-foreground">
            WHERE EVERY FRAME REMEMBERS
          </span>
        </div>
      )}
    </div>
  );
}
