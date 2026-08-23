type ProgressHeaderProps = {
  paperLabel: string
  current: number
  total: number
  correctCount: number
  incorrectCount: number
  onReset: () => void
}

export function ProgressHeader({
  paperLabel,
  current,
  total,
  correctCount,
  incorrectCount,
  onReset,
}: ProgressHeaderProps) {
  const answered = correctCount + incorrectCount
  const pct = total > 0 ? (answered / total) * 100 : 0

  return (
    <header className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400/90 uppercase">
            {paperLabel}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-[#f4efe6] sm:text-2xl">
            Question {current} of {total}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
            {correctCount} correct
          </span>
          <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm font-medium text-rose-300">
            {incorrectCount} incorrect
          </span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-[#d9d2c5] transition hover:border-orange-400/50 hover:text-orange-200"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  )
}
