
export default function CardTitle({label}: {label: string}) {
  return (
    <>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">{label}</span>
    </>
  )
}
