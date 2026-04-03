export function LivePill({ text }: { text: string }) {
  return (
    <span className="rounded-full border-3 border-black bg-[#c7ff66] px-4 py-2 text-[0.78rem] font-bold">
      {text}
    </span>
  )
}
