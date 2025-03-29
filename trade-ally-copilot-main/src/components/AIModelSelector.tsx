import React, { useState } from "react";

export interface AIModelSelectorProps {
  selectedModel: string;
  onSelect: (model: string) => void;
  onClose: () => void;
}

const aiModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most capable, best for complex tasks",
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5",
    description: "Fast and efficient for simple queries",
  },
  {
    id: "claude",
    name: "Claude",
    description: "Good at natural conversation and reasoning",
  },
  {
    id: "llama",
    name: "Llama 3",
    description: "Open source, efficient local execution",
  },
];

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  selectedModel,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1D24] rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-[#282C34] flex justify-between items-center">
          <h3 className="text-lg font-medium">Select AI Model</h3>
          <button
            onClick={onClose}
            className="text-[#787B86] hover:text-white rounded-full p-1"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {aiModels.map((model) => (
            <div
              key={model.id}
              onClick={() => onSelect(model.name)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedModel === model.name
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-[#282C34] hover:bg-[#282C34]"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedModel === model.name
                      ? "border-blue-500"
                      : "border-[#787B86]"
                  }`}
                >
                  {selectedModel === model.name && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{model.name}</h4>
                  <p className="text-xs text-[#787B86] mt-1">
                    {model.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#131722] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModelSelector;
