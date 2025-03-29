import React, { useEffect, useState, useRef } from "react";
import ChartPanel from "@/components/ChartPanel";
import AIPanel from "@/components/AIPanel";
import { getIndicatorByIdOrName } from "@/services/chartService";
import { toast } from "@/hooks/use-toast";
import AIModelSelector from "@/components/AIModelSelector";

const Index = () => {
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState("BINANCE:BTCUSDT");
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const chartWidgetRef = useRef<any>(null);

  // Page load animation
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);

  const handleChartReady = (widget: any) => {
    console.log("Chart widget ready in Index");
    chartWidgetRef.current = widget;
  };

  const handleAddIndicator = (indicatorId: string) => {
    console.log(`Index: Adding indicator ${indicatorId}`);

    // If it's a TV study format, add it directly
    if (indicatorId.includes("@tv-")) {
      if (!activeIndicators.includes(indicatorId)) {
        setActiveIndicators((prev) => [...prev, indicatorId]);
        console.log(`Added indicator: ${indicatorId}`);
      } else {
        console.log(`Indicator ${indicatorId} already exists`);
      }
      return;
    }

    // Otherwise, try to find the indicator by ID or name
    const indicator = getIndicatorByIdOrName(indicatorId);

    if (indicator && !activeIndicators.includes(indicator.tvStudy)) {
      setActiveIndicators((prev) => [...prev, indicator.tvStudy]);
      console.log(`Added indicator: ${indicator.tvStudy}`);
    } else if (indicator) {
      console.log(`Indicator ${indicator.tvStudy} already exists`);
    } else {
      console.error(`Could not find indicator: ${indicatorId}`);
      toast({
        title: "Error",
        description: `Could not find indicator: ${indicatorId}`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveIndicator = (indicatorId: string) => {
    console.log(`Index: Removing indicator ${indicatorId}`);

    // Special case for removing the last indicator
    if (indicatorId === "last") {
      if (activeIndicators.length > 0) {
        const newIndicators = [...activeIndicators];
        const removed = newIndicators.pop();
        setActiveIndicators(newIndicators);
        console.log(`Removed last indicator: ${removed}`);
      }
      return;
    }

    // If it's a TV study format, remove it directly
    if (indicatorId.includes("@tv-")) {
      setActiveIndicators((prev) => prev.filter((id) => id !== indicatorId));
      console.log(`Removed indicator: ${indicatorId}`);
      return;
    }

    // Otherwise, try to find the indicator by ID or name
    const indicator = getIndicatorByIdOrName(indicatorId);

    if (indicator) {
      setActiveIndicators((prev) =>
        prev.filter((id) => id !== indicator.tvStudy)
      );
      console.log(`Removed indicator: ${indicator.tvStudy}`);
    } else {
      console.error(`Could not find indicator to remove: ${indicatorId}`);
    }
  };

  const handleSymbolChange = (symbol: string) => {
    setCurrentSymbol(symbol);
  };

  const toggleAIPanel = () => {
    setShowAIPanel((prev) => !prev);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setIsModelSelectorOpen(false);
  };

  return (
    <div className="flex h-screen bg-black text-[#D9D9D9] overflow-hidden">
      {/* Left sidebar - Narrow icon bar */}
      <div className="w-14 h-full border-r border-[#1A1D24] flex flex-col items-center py-3 bg-[#0e1016]">
        {/* Logo */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-blue-500"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>

        {/* Trading tools */}
        <div className="flex flex-col space-y-5 items-center mt-4 w-full">
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
              <path d="m13 13 6 6"></path>
            </svg>
          </button>
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </button>
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
              <path d="M21.18 8.02A10 10 0 1 0 8.02 21.18L21.18 8.02Z"></path>
            </svg>
          </button>
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <button className="trading-sidebar-button">
            <svg
              className="w-[22px] h-[22px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Panel (Left Side) */}
        <div
          className={`${showAIPanel ? "flex-1" : "w-full"} h-full bg-[#0e1016]`}
        >
          <ChartPanel
            onAddIndicator={handleAddIndicator}
            onRemoveIndicator={handleRemoveIndicator}
            onSymbolChange={handleSymbolChange}
            activeIndicators={activeIndicators}
            currentSymbol={currentSymbol}
          />
        </div>

        {/* AI Panel (Right Side) - Styled to match mockup */}
        {showAIPanel && (
          <div className="w-96 h-full bg-[#0e1016] border-l border-[#1A1D24] flex flex-col">
            <div className="flex items-center justify-between h-14 px-4 border-b border-[#1A1D24] bg-[#131722]">
              <h2 className="text-lg font-medium">AI Assistant</h2>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <button
                    onClick={() => setIsModelSelectorOpen(true)}
                    className="flex items-center space-x-2 px-3 py-1 rounded bg-[#1e222d] hover:bg-[#252833] text-sm"
                  >
                    <span>{selectedModel}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={toggleAIPanel}
                  className="p-1 text-gray-400 hover:text-white"
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
            </div>
            <AIPanel
              chartWidget={chartWidgetRef.current}
              onAddIndicator={handleAddIndicator}
              onRemoveIndicator={handleRemoveIndicator}
              currentSymbol={currentSymbol}
              activeIndicators={activeIndicators}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />

            {/* Model selector modal */}
            {isModelSelectorOpen && (
              <AIModelSelector
                selectedModel={selectedModel}
                onSelect={handleModelChange}
                onClose={() => setIsModelSelectorOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
