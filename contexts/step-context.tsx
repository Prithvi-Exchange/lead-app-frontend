"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface StepContextType {
  step: number
  setStep: (step: number) => void
}

const StepContext = createContext<StepContextType | undefined>(undefined)

export function StepProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0)

  return (
    <StepContext.Provider value={{ step, setStep }}>
      {children}
    </StepContext.Provider>
  )
}

export function useStep() {
  const context = useContext(StepContext)
  if (context === undefined) {
    throw new Error("useStep must be used within a StepProvider")
  }
  return context
}
