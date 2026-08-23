import type { AnswerMap, PaperId, QuizProgress } from '../types'

export const PROGRESS_KEY = 'ccarf-flashcards-progress'

const LEGACY_KEYS = [
  'ccarf-flashcards-active-paper',
  'ccarf-flashcards-progress:paper-1',
  'ccarf-flashcards-progress:paper-2',
  'ccarf-flashcards-progress:paper-3',
]

export type StoredProgress = QuizProgress & {
  paperId: PaperId
}

function isPaperId(value: unknown): value is PaperId {
  return value === 'paper-1' || value === 'paper-2' || value === 'paper-3'
}

export function clearLegacyProgressKeys() {
  try {
    for (const key of LEGACY_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    /* ignore */
  }
}

export function loadStoredProgress(): StoredProgress | null {
  try {
    clearLegacyProgressKeys()
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredProgress>
    if (
      !isPaperId(parsed.paperId) ||
      typeof parsed.currentIndex !== 'number' ||
      typeof parsed.answers !== 'object' ||
      parsed.answers === null
    ) {
      return null
    }
    return {
      paperId: parsed.paperId,
      currentIndex: parsed.currentIndex,
      answers: parsed.answers as AnswerMap,
    }
  } catch {
    return null
  }
}

export function saveStoredProgress(progress: StoredProgress) {
  try {
    clearLegacyProgressKeys()
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* ignore */
  }
}

export function clearStoredProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY)
    clearLegacyProgressKeys()
  } catch {
    /* ignore */
  }
}
