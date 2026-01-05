'use client';

interface LoadingStateProps {
  steps: {
    label: string;
    completed: boolean;
  }[];
}

export default function LoadingState({ steps }: LoadingStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">⏳ AI가 트렌드를 분석하고 있습니다...</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`flex-shrink-0 ${step.completed ? 'text-green-500' : 'text-gray-400'}`}>
              {step.completed ? '✅' : '⏳'}
            </div>
            <div className={`flex-1 ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
