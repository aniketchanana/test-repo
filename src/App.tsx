import { useMemo, useState } from 'react'
import { Flashcard } from './components/Flashcard'
import { Onboarding } from './components/Onboarding'
import { ProgressHeader } from './components/ProgressHeader'
import { getQuestionsForPaper, PAPERS } from './data/papers'
import { useQuiz } from './hooks/useQuiz'
import {
  clearStoredProgress,
  loadStoredProgress,
  saveStoredProgress,
} from './lib/progress'
import type { PaperId } from './types'

function QuizSession({
  paperId,
  onReset,
}: {
  paperId: PaperId
  onReset: () => void
}) {
  const questions = useMemo(() => getQuestionsForPaper(paperId), [paperId])
  const quiz = useQuiz(questions, paperId)
  const paper = PAPERS.find((p) => p.id === paperId)

  if (!quiz.current || !paper) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 text-[#f4efe6]">
        No questions found.
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <ProgressHeader
        paperLabel={paper.label}
        current={quiz.currentIndex + 1}
        total={quiz.total}
        correctCount={quiz.correctCount}
        incorrectCount={quiz.incorrectCount}
        onReset={() => {
          quiz.reset()
          onReset()
        }}
      />

      <Flashcard
        question={quiz.current}
        selected={quiz.selected}
        isAnswered={quiz.isAnswered}
        isCorrect={quiz.isCorrect}
        selectCount={quiz.selectCount}
        onSelect={quiz.selectOption}
      />

      <div className="flex items-center justify-between gap-3 pb-4">
        <button
          type="button"
          onClick={quiz.prev}
          disabled={!quiz.canPrev}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#f4efe6] transition hover:border-orange-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Previous
        </button>
        <p className="hidden text-center text-xs text-[#9a9286] sm:block sm:text-sm">
          {quiz.isAnswered
            ? 'Review the answer, then continue'
            : 'Choose an option to flip the card'}
        </p>
        <button
          type="button"
          onClick={quiz.next}
          disabled={!quiz.canNext}
          className="rounded-xl border border-orange-500/40 bg-orange-500/20 px-5 py-2.5 text-sm font-medium text-orange-100 transition hover:bg-orange-500/30 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [paperId, setPaperId] = useState<PaperId | null>(
    () => loadStoredProgress()?.paperId ?? null,
  )
  const [pendingPaperId, setPendingPaperId] = useState<PaperId | null>(
    () => loadStoredProgress()?.paperId ?? null,
  )

  const handleStart = () => {
    if (!pendingPaperId) return
    clearStoredProgress()
    saveStoredProgress({
      paperId: pendingPaperId,
      currentIndex: 0,
      answers: {},
    })
    setPaperId(pendingPaperId)
  }

  const handleResetToOnboarding = () => {
    clearStoredProgress()
    setPaperId(null)
    setPendingPaperId(null)
  }

  if (!paperId) {
    return (
      <Onboarding
        papers={PAPERS}
        selectedPaperId={pendingPaperId}
        onSelect={setPendingPaperId}
        onStart={handleStart}
      />
    )
  }

  return <QuizSession paperId={paperId} onReset={handleResetToOnboarding} />
}
