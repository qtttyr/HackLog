type StatTileProps = { label: string; value: string; note: string; tone?: string }

export function StatTile({ label, value, note, tone = 'bg-white' }: StatTileProps) {
  return (
    <article className={`brutal-card p-5 ${tone}`.trim()}>
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-[2rem] font-black leading-none md:text-[2.4rem]">{value}</p>
      <p className="mt-3 text-[0.95rem] leading-6 text-slate-700">{note}</p>
    </article>
  )
}
