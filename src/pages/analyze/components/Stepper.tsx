interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  onStepClick: (stepId: number) => void;
}

export default function Stepper({ steps, activeStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto px-4">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isCompleted = activeStep > step.id;
        const isClickable = step.id === activeStep - 1;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step Item (Circle + Label) */}
            <button type="button" disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`flex flex-col items-center gap-2 group focus:outline-none ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              }`}>
              {/* Circle */}
              <div
                className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-(--primaryBlue) text-white shadow-md shadow-(--primaryBlue)/30 ring-2 ring-(--primaryBlue)/20"
                    : isCompleted
                    ? "bg-(--lightBlack) text-white"
                    : "bg-(--lightBlack)/30 text-(--secondaryBlack)"
                } ${isClickable ? "group-hover:ring-2 group-hover:ring-(--primaryBlue)/40" : ""}`}>
                {step.id + 1}
              </div>

              {/* Label */}
              <span className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-(--primaryBlack) font-semibold"
                    : isCompleted ? "text-(--secondaryBlack)" : "text-(--secondaryBlack)"
                } ${isClickable ? "group-hover:text-(--primaryBlue)" : ""}`}>
                {step.label}
              </span>
            </button>

            {/* Connecting Dash / Line between steps */}
            {!isLast && (
              <div className={`h-0.5 flex-1 mx-4 sm:mx-8 mb-6 transition-colors duration-300 ${
                  isCompleted ? "bg-(--lightBlack)" : "bg-(--lightBlack)/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

