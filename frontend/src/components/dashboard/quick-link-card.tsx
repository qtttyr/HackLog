import { Link } from 'react-router-dom'

type QuickLinkCardProps = { to: string; title: string; text: string; cta: string }

export function QuickLinkCard({ to, title, text, cta }: QuickLinkCardProps) {
  return (
    <Link to={to} className="brutal-card block bg-white p-5 transition-transform hover:-translate-y-1">
      <p className="eyebrow mb-2">Workspace</p>
      <h3 className="text-[1.1rem] font-bold">{title}</h3>
      <p className="mt-3 text-[0.95rem] leading-6 text-slate-700">{text}</p>
      <p className="mt-4 font-bold">{cta} {'->'}</p>
    </Link>
  )
}
