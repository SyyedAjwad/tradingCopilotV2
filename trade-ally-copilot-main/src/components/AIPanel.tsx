import React, { useState, useRef, useEffect } from "react";
import {
  addIndicatorToChart,
  removeIndicatorFromChart,
  availableIndicators,
} from "@/services/chartService";
import AIModelSelector from "./AIModelSelector";
import MessageItem from "./MessageItem";
import { toast } from "@/hooks/use-toast";

interface AIAssistantMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  actions?: AIAction[];
}

interface AIAction {
  id: string;
  text: string;
  handler: () => void;
}

interface AIContextState {
  activeIndicators: string[];
  currentSymbol: string;
  chartTimeframe: string;
}

interface AIAssistantProps {
  chartWidget: any;
  onAddIndicator?: (indicatorId: string) => void;
  onRemoveIndicator?: (indicatorId: string) => void;
  currentSymbol?: string;
  activeIndicators?: string[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const AIPanel: React.FC<AIAssistantProps> = ({
  chartWidget,
  onAddIndicator,
  onRemoveIndicator,
  currentSymbol = "BINANCE:BTCUSDT",
  activeIndicators = [],
  selectedModel = "GPT-4",
  onModelChange,
}) => {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // State to keep track of chart context for the AI to reference
  const [aiContext, setAiContext] = useState<AIContextState>({
    activeIndicators: [],
    currentSymbol: currentSymbol,
    chartTimeframe: "1h",
  });

  // Update AI context when props change
  useEffect(() => {
    setAiContext((prev) => ({
      ...prev,
      activeIndicators: activeIndicators,
      currentSymbol: currentSymbol || prev.currentSymbol,
    }));
  }, [activeIndicators, currentSymbol]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: AIAssistantMessage = {
      id: "welcome",
      role: "ai",
      content: "Hello! How can I assist you today?",
      timestamp: new Date(),
      actions: [
        {
          id: "add-rsi",
          text: "Add RSI",
          handler: () => handleAddIndicator("rsi"),
        },
        {
          id: "add-volume",
          text: "Add Volume",
          handler: () => handleAddIndicator("volume"),
        },
        {
          id: "analyze-chart",
          text: "Analyze Current Chart",
          handler: () => simulateAnalyzeChart(),
        },
      ],
    };

    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessageId = `user-${Date.now()}`;
    const userMessage: AIAssistantMessage = {
      id: userMessageId,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      processUserMessage(inputValue, userMessageId);
      setIsThinking(false);
    }, 1000);
  };

  // Process the user message and generate a response
  const processUserMessage = (message: string, messageId: string) => {
    const lowerMessage = message.toLowerCase();

    // Check if the message is about adding an indicator
    if (
      lowerMessage.includes("add") &&
      (lowerMessage.includes("indicator") ||
        lowerMessage.includes("rsi") ||
        lowerMessage.includes("macd") ||
        lowerMessage.includes("bollinger"))
    ) {
      // Look for the indicator name in the message
      const indicator = availableIndicators.find(
        (ind) =>
          lowerMessage.includes(ind.id) ||
          lowerMessage.includes(ind.name.toLowerCase())
      );

      if (indicator) {
        // If found, add the indicator and generate a response
        handleAddIndicator(indicator.id);
        return;
      } else {
        // If no specific indicator found, suggest some options
        const aiResponse: AIAssistantMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content:
            "Which indicator would you like to add? Here are some popular ones:",
          timestamp: new Date(),
          actions: [
            {
              id: "add-rsi",
              text: "Add RSI",
              handler: () => handleAddIndicator("rsi"),
            },
            {
              id: "add-macd",
              text: "Add MACD",
              handler: () => handleAddIndicator("macd"),
            },
            {
              id: "add-bb",
              text: "Add Bollinger Bands",
              handler: () => handleAddIndicator("bb"),
            },
          ],
        };
        setMessages((prev) => [...prev, aiResponse]);
        return;
      }
    }

    // Check if the message is about removing an indicator
    if (
      lowerMessage.includes("remove") &&
      (lowerMessage.includes("indicator") ||
        lowerMessage.includes("rsi") ||
        lowerMessage.includes("macd"))
    ) {
      // If there are active indicators, suggest removing one
      if (activeIndicators.length > 0) {
        // Convert TV study names to more readable names for display
        const displayIndicators = activeIndicators.map((study) => {
          const indicator = availableIndicators.find(
            (ind) => ind.tvStudy === study
          );
          return indicator
            ? indicator.name
            : study.replace("@tv-basicstudies", "");
        });

        const aiResponse: AIAssistantMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: `Which indicator would you like to remove? Currently active: ${displayIndicators.join(
            ", "
          )}`,
          timestamp: new Date(),
          actions: activeIndicators.map((study) => {
            const indicator = availableIndicators.find(
              (ind) => ind.tvStudy === study
            );
            const displayName = indicator
              ? indicator.name
              : study.replace("@tv-basicstudies", "");
            return {
              id: `remove-${indicator?.id || study}`,
              text: `Remove ${displayName}`,
              handler: () => handleRemoveIndicator(indicator?.id || study),
            };
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
        return;
      } else {
        // If no active indicators
        const aiResponse: AIAssistantMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content:
            "There are no active indicators to remove. Would you like to add one?",
          timestamp: new Date(),
          actions: [
            {
              id: "add-rsi",
              text: "Add RSI",
              handler: () => handleAddIndicator("rsi"),
            },
            {
              id: "add-volume",
              text: "Add Volume",
              handler: () => handleAddIndicator("volume"),
            },
          ],
        };
        setMessages((prev) => [...prev, aiResponse]);
        return;
      }
    }

    // Check for chart analysis request
    if (
      lowerMessage.includes("analyze") ||
      lowerMessage.includes("analysis") ||
      lowerMessage.includes("what do you think")
    ) {
      simulateAnalyzeChart();
      return;
    }

    // Default response for other messages
    const aiResponse: AIAssistantMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content:
        "I can help with technical analysis and adding indicators to your chart. What would you like to do?",
      timestamp: new Date(),
      actions: [
        {
          id: "analyze",
          text: "Analyze Current Chart",
          handler: () => simulateAnalyzeChart(),
        },
        {
          id: "add-indicator",
          text: "Add Indicator",
          handler: () => showAddIndicatorOptions(),
        },
      ],
    };

    setMessages((prev) => [...prev, aiResponse]);
  };

  // Simulate chart analysis
  const simulateAnalyzeChart = () => {
    setIsThinking(true);

    setTimeout(() => {
      const analysis = getRandomAnalysis();

      const aiResponse: AIAssistantMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: analysis,
        timestamp: new Date(),
        actions: [
          {
            id: "add-rsi",
            text: "Add RSI",
            handler: () => handleAddIndicator("rsi"),
          },
          {
            id: "add-bb",
            text: "Add Bollinger Bands",
            handler: () => handleAddIndicator("bb"),
          },
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  // Show options for adding indicators
  const showAddIndicatorOptions = () => {
    const aiResponse: AIAssistantMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content: "Here are some popular indicators you can add:",
      timestamp: new Date(),
      actions: [
        {
          id: "add-rsi",
          text: "Add RSI",
          handler: () => handleAddIndicator("rsi"),
        },
        {
          id: "add-macd",
          text: "Add MACD",
          handler: () => handleAddIndicator("macd"),
        },
        {
          id: "add-bb",
          text: "Add Bollinger Bands",
          handler: () => handleAddIndicator("bb"),
        },
        {
          id: "add-ema",
          text: "Add EMA",
          handler: () => handleAddIndicator("ema"),
        },
        {
          id: "add-volume",
          text: "Add Volume",
          handler: () => handleAddIndicator("volume"),
        },
      ],
    };

    setMessages((prev) => [...prev, aiResponse]);
  };

  // Handle adding an indicator
  const handleAddIndicator = (indicatorId: string) => {
    // First add the indicator through the parent component
    if (onAddIndicator) {
      onAddIndicator(indicatorId);
    }

    // Find the indicator details for the response
    const indicator = availableIndicators.find((ind) => ind.id === indicatorId);
    const indicatorName = indicator ? indicator.name : indicatorId;

    // Add AI confirmation message
    const aiResponse: AIAssistantMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content: `The ${indicatorName} indicator has been added. It is now visible below the chart. What would you like to do next?`,
      timestamp: new Date(),
      actions: [
        {
          id: `remove-${indicatorId}`,
          text: `Remove ${indicatorName}`,
          handler: () => handleRemoveIndicator(indicatorId),
        },
        {
          id: `analyze-with-${indicatorId}`,
          text: `Analyze with ${indicatorName}`,
          handler: () => simulateIndicatorAnalysis(indicatorId),
        },
      ],
    };

    setMessages((prev) => [...prev, aiResponse]);
  };

  // Handle removing an indicator
  const handleRemoveIndicator = (indicatorId: string) => {
    // Remove the indicator through the parent component
    if (onRemoveIndicator) {
      onRemoveIndicator(indicatorId);
    }

    // Find the indicator details for the response
    const indicator = availableIndicators.find((ind) => ind.id === indicatorId);
    const indicatorName = indicator ? indicator.name : indicatorId;

    // Add AI confirmation message
    const aiResponse: AIAssistantMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      content: `The ${indicatorName} indicator has been removed. What would you like to do next?`,
      timestamp: new Date(),
      actions: [
        {
          id: "add-another",
          text: "Add Another Indicator",
          handler: showAddIndicatorOptions,
        },
        {
          id: "analyze-chart",
          text: "Analyze Current Chart",
          handler: simulateAnalyzeChart,
        },
      ],
    };

    setMessages((prev) => [...prev, aiResponse]);
  };

  // Simulate analysis with a specific indicator
  const simulateIndicatorAnalysis = (indicatorId: string) => {
    setIsThinking(true);

    setTimeout(() => {
      const indicator = availableIndicators.find(
        (ind) => ind.id === indicatorId
      );
      const indicatorName = indicator ? indicator.name : indicatorId;

      let analysis = "";

      if (indicatorId === "rsi") {
        analysis =
          "The RSI is currently at 14, indicating that the asset is in oversold territory. This could potentially signal a bullish reversal in the near future. Watch for price to confirm this signal with a move above recent resistance levels.";
      } else if (indicatorId === "macd") {
        analysis =
          "The MACD line is below the signal line, indicating bearish momentum. However, the histogram bars are getting smaller, suggesting that the bearish momentum may be weakening. Watch for a potential crossover which could signal a change in trend.";
      } else if (indicatorId === "bb") {
        analysis =
          "Price is currently testing the lower Bollinger Band, suggesting it's relatively low compared to its recent range. This could indicate a potential bounce, especially if accompanied by positive divergence in momentum indicators.";
      } else if (indicatorId === "volume") {
        analysis =
          "Recent price declines have occurred on lower volume, suggesting that selling pressure may be diminishing. Watch for increasing volume on price rebounds as confirmation of potential trend reversal.";
      } else {
        analysis = `Based on the ${indicatorName} indicator, the market is showing signs of a potential reversal. Current price action, combined with this indicator, suggests caution but with opportunities for strategic entries.`;
      }

      const aiResponse: AIAssistantMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: analysis,
        timestamp: new Date(),
        actions: [
          {
            id: "add-another",
            text: "Add Another Indicator",
            handler: showAddIndicatorOptions,
          },
          {
            id: "remove-indicator",
            text: `Remove ${indicatorName}`,
            handler: () => handleRemoveIndicator(indicatorId),
          },
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  // Helper function to get a random analysis
  const getRandomAnalysis = () => {
    const analyses = [
      "The price is currently showing a bearish trend on the 1-hour timeframe. The recent candle pattern suggests continued downward momentum. Consider waiting for a potential bounce off support levels before entering any long positions.",
      "Bitcoin appears to be consolidating after a significant drop. The current price action is forming a potential descending triangle pattern, which typically breaks to the downside. Key support levels are at $68,000 and $65,500.",
      "Looking at the chart, we can see that Bitcoin is testing a key resistance level around $84,400. RSI shows potential bearish divergence. If this resistance holds, we could see a retracement to the support zone around $80,000.",
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  // Handle model selection
  const handleModelSelect = (model: string) => {
    if (onModelChange) {
      onModelChange(model);
    }
    setIsModelSelectorOpen(false);

    toast({
      title: `Model Changed`,
      description: `AI Assistant is now using ${model}`,
    });
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div key={message.id} className="mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  message.role === "ai"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {message.role === "ai" ? "AI" : "U"}
              </div>
              <div className="text-xs text-[#787B86]">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
            <div className="pl-8 text-sm break-words">{message.content}</div>
            {message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 pl-8">
                {message.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.handler}
                    className="px-3 py-1 bg-[#1A1D24] hover:bg-[#252833] rounded text-sm transition-colors"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                AI
              </div>
              <div className="text-xs text-[#787B86]">
                {formatTimestamp(new Date())}
              </div>
            </div>
            <div className="pl-8">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* End of messages reference for auto-scrolling */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[#1A1D24] bg-[#0e1016]">
        <div className="flex items-center bg-[#1A1D24] rounded-md px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What do you think?"
            className="w-full bg-transparent outline-none text-sm text-[#D9D9D9] placeholder-[#787B86]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isThinking}
            className="ml-2 text-blue-500 disabled:text-gray-600"
          >
            <svg
              className="w-5 h-5 rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Model selector modal */}
      {isModelSelectorOpen && (
        <AIModelSelector
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
          onClose={() => setIsModelSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default AIPanel;
