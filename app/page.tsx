"use client"

import { ForexBookingForm } from "@/components/forex-booking-form"
import { StepProvider, useStep } from "@/contexts/step-context"

function HomeContent() {
  const { step } = useStep()
  const progress = Math.round((step / 3) * 100)

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">ForexFlow</h1>
        <p className="text-muted-foreground font-medium">Premium Currency Exchange Platform</p>
      </div>

      {/* Progress Bar - Outside Card */}
      <div className="w-full max-w-[600px] mb-8">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-blue-600 transition-all duration-700"
            style={{ width: `${progress}%`, transitionTimingFunction: 'cubic-bezier(0.2,0.8,0.2,1)' }}
          />
        </div>
      </div>

      {/* Main Form Card */}
      <ForexBookingForm />

      {/* Footer */}
      
    </main>
  )
}

export default function Home() {
  return (
    <StepProvider>
      <HomeContent />
    </StepProvider>
  )
}
