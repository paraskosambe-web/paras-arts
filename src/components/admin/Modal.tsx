import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm animate-fade-in sm:p-4"
      onClick={onClose}
    >
      <div
        className="my-4 w-full min-w-0 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-4 sm:rounded-3xl sm:p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h2 className="min-w-0 break-words font-display text-xl sm:text-2xl">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 hover:border-gold-light hover:text-gold-light"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 min-w-0 sm:mt-6">{children}</div>
      </div>
    </div>
  );
}

export const adminInput =
  "w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-gold-light/50";

export const adminLabel =
  "mb-2 block text-[10px] tracking-[0.3em] uppercase text-gold-light";