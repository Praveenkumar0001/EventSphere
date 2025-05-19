import React from "react";

function Stepper({ currentStep }) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex justify-center items-center mb-10 mt-16">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <span className="text-white">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-70 h-1 mx-6 ${
                  currentStep > step
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;
