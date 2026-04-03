import type { PropsWithChildren } from 'react'

type SectionCardProps = PropsWithChildren<{ title: string; hint?: string; className?: string }>

export function SectionCard({ title, hint, className = '', children }: SectionCardProps) {
  return (
    <section className={`brutal-card p-5 ${className}`.trim()}>
      {hint ? <p className="eyebrow mb-2">{hint}</p> : null}
      <h2 className="text-[1.25rem] font-bold md:text-[1.55rem]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
