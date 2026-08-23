import type { Paper, PaperId } from '../types'

type OnboardingProps = {
  papers: Paper[]
  selectedPaperId: PaperId | null
  onSelect: (paperId: PaperId) => void
  onStart: () => void
}

export function Onboarding({
  papers,
  selectedPaperId,
  onSelect,
  onStart,
}: OnboardingProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center gap-8 px-4 py-10 sm:px-6">
      <div className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-400/90 uppercase">
          CCARF Practice Exam
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f4efe6] sm:text-4xl">
          Choose a question paper
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[#a89f91] sm:text-base">
          Pick one set to study. Progress is saved for that paper only — reset
          clears it and brings you back here.
        </p>
      </div>

      <div className="grid gap-3">
        {papers.map((paper) => {
          const selected = paper.id === selectedPaperId
          return (
            <button
              key={paper.id}
              type="button"
              onClick={() => onSelect(paper.id)}
              className={`rounded-2xl border px-5 py-4 text-left transition ${
                selected
                  ? 'border-orange-400/70 bg-orange-500/20 shadow-[0_0_0_1px_rgba(251,146,60,0.25)]'
                  : 'border-white/12 bg-white/5 hover:border-orange-400/40 hover:bg-white/8'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[#f4efe6]">
                    {paper.label}
                  </p>
                  <p className="mt-1 text-sm text-[#a89f91]">
                    {paper.description}
                  </p>
                </div>
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    selected
                      ? 'border-orange-400 bg-orange-500 text-[10px] text-white'
                      : 'border-white/25'
                  }`}
                  aria-hidden
                >
                  {selected ? '✓' : ''}
                </span>
              </div>
              <p className="mt-3 text-xs font-medium tracking-wide text-[#8a8276] uppercase">
                {paper.questionCount} questions
              </p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!selectedPaperId}
        onClick={onStart}
        className="rounded-xl border border-orange-500/50 bg-orange-500/25 px-6 py-3 text-base font-semibold text-orange-50 transition hover:bg-orange-500/35 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start studying
      </button>
    </div>
  )
}
