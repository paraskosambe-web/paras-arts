export function AdminHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-6">
      <div>
        <div className="text-[10px] tracking-[0.4em] uppercase text-gold-light">{eyebrow}</div>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
