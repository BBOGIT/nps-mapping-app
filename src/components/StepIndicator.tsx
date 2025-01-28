import React from 'react';

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  // Створюємо масив кроків для відображення
  const stepsArray = Array.from({ length: steps }, (_, index) => ({
    number: index + 1,
    isActive: index < currentStep,
    isCurrent: index === currentStep - 1
  }));

  return (
    <div className="w-full mb-8">
      {/* Заголовок з номером поточного кроку */}
      <h2 className="text-xl font-semibold mb-4">Step {currentStep}</h2>
      
      {/* Контейнер для індикатора прогресу */}
      <div className="relative flex items-center justify-between">
        {/* Лінія прогресу */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full" />
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#E31E24] transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps - 1)) * 100}%` }}
        />

        {/* Кроки */}
        {stepsArray.map(({ number, isActive, isCurrent }) => (
          <div key={number} className="relative flex flex-col items-center">
            {/* Кружок кроку */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 
                ${isCurrent ? 'bg-[#E31E24] text-white' : 
                  isActive ? 'bg-[#E31E24] text-white' : 
                  'bg-white border-2 border-gray-300 text-gray-500'}`}
            >
              {number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;