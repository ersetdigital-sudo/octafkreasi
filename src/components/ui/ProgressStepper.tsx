import React from 'react';
import type { StepConfig } from '@/types';
import { cn } from '@/lib/utils';

export interface ProgressStepperProps {
  steps: StepConfig[];
  currentStep: number;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProgressStepper({ steps, currentStep, className }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.number}
              className={cn('flex flex-1 items-center', isLast && 'flex-none')}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10',
                    isCompleted && 'bg-primary text-white',
                    isActive && 'bg-primary text-white',
                    !isCompleted && !isActive && 'border-2 border-gray-300 text-gray-400'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-center text-xs font-medium sm:text-sm',
                    (isCompleted || isActive) ? 'text-primary' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 sm:mx-4',
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
