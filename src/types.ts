export type OptionLetter = 'A' | 'B' | 'C' | 'D' | 'E'

export type Question = {
  id: number
  domain: string
  question: string
  options: Partial<Record<OptionLetter, string>>
  feedback: Partial<Record<OptionLetter, string>>
  correct_answer: OptionLetter | OptionLetter[]
  select_count?: number
}

export type AnswerMap = Record<number, OptionLetter | OptionLetter[]>

export type QuizProgress = {
  currentIndex: number
  answers: AnswerMap
}

export type PaperId = 'paper-1' | 'paper-2' | 'paper-3'

export type Paper = {
  id: PaperId
  label: string
  description: string
  questionCount: number
}
