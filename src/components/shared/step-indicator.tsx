"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "브레인덤프" },
  { id: 2, label: "빅3 선정" },
  { id: 3, label: "타임라인" },
  { id: 4, label: "리뷰" },
];

export function StepIndicator({ currentStep, onStepChange }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
      {STEPS.map((step) => (
        <button
          key={step.id}
          onClick={() => onStepChange(step.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentStep === step.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
            currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20"
          )}>
            {step.id}
          </span>
          <span className="hidden sm:inline">{step.label}</span>
        </button>
      ))}
    </div>
  );
}
