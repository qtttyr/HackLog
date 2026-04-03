import type { Decision } from '../../types/domain'

export function DecisionItem({ decision }: { decision: Decision }) {
  return (
    <article className="brutal-card bg-white p-4">
      <p className="text-[1rem] leading-6">{decision.content}</p>
      <p className="mt-3 text-[0.82rem] font-bold text-slate-500">{decision.createdAt}</p>
    </article>
  )
}
