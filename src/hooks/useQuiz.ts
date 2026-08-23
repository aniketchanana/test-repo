import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearStoredProgress,
  loadStoredProgress,
  saveStoredProgress,
} from '../lib/progress'
import type { AnswerMap, OptionLetter, PaperId, Question } from '../types'

export function normalizeCorrect(
  correct: Question['correct_answer'],
): OptionLetter[] {
  return Array.isArray(correct) ? correct : [correct]
}

export function answersMatch(
  selected: OptionLetter | OptionLetter[] | undefined,
  correct: Question['correct_answer'],
): boolean {
  if (selected === undefined) return false
  const selectedList = Array.isArray(selected)
    ? [...selected].sort()
    : [selected]
  const correctList = [...normalizeCorrect(correct)].sort()
  if (selectedList.length !== correctList.length) return false
  return selectedList.every((letter, i) => letter === correctList[i])
}

function selectionSize(selected: OptionLetter | OptionLetter[] | undefined) {
  if (selected === undefined) return 0
  return Array.isArray(selected) ? selected.length : 1
}

export function useQuiz(questions: Question[], paperId: PaperId) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = loadStoredProgress()
    if (!saved || saved.paperId !== paperId) return 0
    return Math.min(
      Math.max(saved.currentIndex, 0),
      Math.max(questions.length - 1, 0),
    )
  })
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    const saved = loadStoredProgress()
    if (!saved || saved.paperId !== paperId) return {}
    return saved.answers
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadStoredProgress()
    if (saved && saved.paperId === paperId) {
      setCurrentIndex(
        Math.min(
          Math.max(saved.currentIndex, 0),
          Math.max(questions.length - 1, 0),
        ),
      )
      setAnswers(saved.answers)
    } else {
      setCurrentIndex(0)
      setAnswers({})
      saveStoredProgress({ paperId, currentIndex: 0, answers: {} })
    }
    setReady(true)
  }, [paperId, questions.length])

  useEffect(() => {
    if (!ready) return
    saveStoredProgress({ paperId, currentIndex, answers })
  }, [answers, currentIndex, paperId, ready])

  const current = questions[currentIndex]
  const selected = current ? answers[current.id] : undefined
  const selectCount = current?.select_count ?? 1
  const isAnswered =
    selected !== undefined && selectionSize(selected) >= selectCount

  const { correctCount, incorrectCount } = useMemo(() => {
    let correct = 0
    let incorrect = 0
    for (const q of questions) {
      const ans = answers[q.id]
      const needed = q.select_count ?? 1
      if (ans === undefined || selectionSize(ans) < needed) continue
      if (answersMatch(ans, q.correct_answer)) correct += 1
      else incorrect += 1
    }
    return { correctCount: correct, incorrectCount: incorrect }
  }, [answers, questions])

  const selectOption = useCallback(
    (letter: OptionLetter) => {
      if (!current) return
      const needed = current.select_count ?? 1
      const existing = answers[current.id]
      if (existing !== undefined && selectionSize(existing) >= needed) return

      if (needed === 1) {
        setAnswers((prev) => ({ ...prev, [current.id]: letter }))
        return
      }

      setAnswers((prev) => {
        const currentSelection = Array.isArray(prev[current.id])
          ? [...(prev[current.id] as OptionLetter[])]
          : []
        if (currentSelection.includes(letter)) {
          const next = currentSelection.filter((l) => l !== letter)
          if (next.length === 0) {
            const { [current.id]: _, ...rest } = prev
            return rest
          }
          return { ...prev, [current.id]: next }
        }
        if (currentSelection.length >= needed) return prev
        return { ...prev, [current.id]: [...currentSelection, letter] }
      })
    },
    [answers, current],
  )

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
  }, [questions.length])

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    clearStoredProgress()
  }, [])

  const isCorrect =
    isAnswered && current
      ? answersMatch(selected, current.correct_answer)
      : false

  return {
    current,
    currentIndex,
    total: questions.length,
    selected,
    isAnswered,
    isCorrect,
    correctCount,
    incorrectCount,
    selectOption,
    next,
    prev,
    reset,
    canPrev: currentIndex > 0,
    canNext: currentIndex < questions.length - 1,
    selectCount,
  }
}
