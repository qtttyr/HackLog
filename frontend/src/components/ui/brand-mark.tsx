import { Link } from 'react-router-dom'

export function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="brand-badge">HL</span>
      <div>
        <p className="eyebrow">Hackathon tracker</p>
        <p className="text-[1rem] font-bold">HackLog</p>
      </div>
    </Link>
  )
}
