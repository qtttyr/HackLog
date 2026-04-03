type FeatureCardProps = { title: string; text: string; accent: string }

export function FeatureCard({ title, text, accent }: FeatureCardProps) {
  return (
    <article className={`brutal-card p-5 ${accent}`.trim()}>
      <p className="eyebrow mb-2">Why it helps</p>
      <h3 className="text-[1.1rem] font-bold">{title}</h3>
      <p className="mt-3 text-balance text-[0.96rem] leading-6 text-slate-700">{text}</p>
    </article>
  )
}
