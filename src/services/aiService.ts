
import { availableIndicators, getIndicatorByIdOrName } from './chartService';

export interface AIModel {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AIMessage {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: string;
  suggestedActions?: AIAction[];
  addedIndicator?: string; // Track which indicator was added by this message
}

export interface AIAction {
  type: 'add_indicator' | 'remove_indicator' | 'analyze_chart' | 'change_symbol';
  label: string;
  payload?: any;
}

// Available AI models
export const aiModels: AIModel[] = [
  { 
    id: 'trend', 
    name: 'Trend Analyzer', 
    icon: 'LineChart',
    description: 'Specializes in identifying long-term trends and market direction'
  },
  { 
    id: 'momentum', 
    name: 'Momentum Predictor', 
    icon: 'Zap',
    description: 'Focuses on momentum indicators like RSI and MACD to predict short-term price movements'
  },
  { 
    id: 'volatility', 
    name: 'Volatility Scanner', 
    icon: 'BarChart3',
    description: 'Analyzes market volatility patterns and price range breakouts'
  },
  { 
    id: 'pattern', 
    name: 'Pattern Recognition', 
    icon: 'Braces',
    description: 'Identifies chart patterns like head and shoulders, triangles, and wedges'
  },
];

// Detect indicator mentions in a message
export const detectIndicatorMention = (message: string): string | null => {
  const words = message.toLowerCase().split(/\s+/);
  
  // Check for "add" or "show" + indicator pattern
  for (let i = 0; i < words.length - 1; i++) {
    if ((words[i] === 'add' || words[i] === 'show' || words[i] === 'apply') && words[i+1]) {
      // Try to find indicator with the word after "add"/"show"
      const indicator = getIndicatorByIdOrName(words[i+1]);
      if (indicator) return indicator.id;
      
      // If not found and there's another word, try two-word name
      if (i+2 < words.length) {
        const twoWordName = `${words[i+1]} ${words[i+2]}`;
        const indicator = getIndicatorByIdOrName(twoWordName);
        if (indicator) return indicator.id;
      }
    }
  }
  
  // Check for direct indicator mentions without "add"/"show"
  for (const indicator of availableIndicators) {
    if (message.toLowerCase().includes(indicator.id) || 
        message.toLowerCase().includes(indicator.name.toLowerCase())) {
      return indicator.id;
    }
  }
  
  return null;
};

// Check if message is about removing an indicator
export const isRemoveIndicatorRequest = (message: string): boolean => {
  const removePhrases = ['remove', 'delete', 'take off', 'hide'];
  const lowerMessage = message.toLowerCase();
  
  for (const phrase of removePhrases) {
    if (lowerMessage.includes(phrase)) {
      // Check if any indicator is mentioned
      for (const indicator of availableIndicators) {
        if (lowerMessage.includes(indicator.id) || 
            lowerMessage.includes(indicator.name.toLowerCase())) {
          return true;
        }
      }
      
      // General removal request (like "remove indicator" or "remove the last indicator")
      if (lowerMessage.includes('indicator') || 
          lowerMessage.includes('study') ||
          lowerMessage.includes('last one')) {
        return true;
      }
    }
  }
  
  return false;
};

// Mock AI responses based on the user message and selected model
export const generateAIResponse = (
  message: string,
  modelId: string,
  symbol: string,
  activeIndicators: string[] = []
): Promise<AIMessage> => {
  return new Promise((resolve) => {
    // Get the current timestamp
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate AI thinking time
    setTimeout(() => {
      let response: AIMessage;
      let indicatorToAdd: string | null = null;
      
      // Check if message is about removing an indicator
      if (isRemoveIndicatorRequest(message)) {
        // If there are active indicators, suggest removing the last one
        if (activeIndicators.length > 0) {
          // Find the indicator in our list
          const lastIndicatorId = activeIndicators[activeIndicators.length - 1];
          const indicatorObj = availableIndicators.find(ind => ind.tvStudy === lastIndicatorId);
          
          response = {
            id: Date.now(),
            text: `I can remove the ${indicatorObj?.name || 'last'} indicator from the chart. Would you like me to proceed?`,
            isAI: true,
            timestamp,
            suggestedActions: [
              {
                type: 'remove_indicator',
                label: `Remove ${indicatorObj?.name || 'Indicator'}`,
                payload: indicatorObj?.id || 'last'
              }
            ]
          };
        } else {
          response = {
            id: Date.now(),
            text: `There are no indicators currently on the chart. Would you like me to add one?`,
            isAI: true,
            timestamp,
            suggestedActions: [
              {
                type: 'add_indicator',
                label: 'Add RSI',
                payload: 'rsi'
              },
              {
                type: 'add_indicator',
                label: 'Add Moving Average',
                payload: 'ma'
              }
            ]
          };
        }
      } 
      // Check for indicator addition requests
      else if ((indicatorToAdd = detectIndicatorMention(message)) !== null) {
        const indicator = getIndicatorByIdOrName(indicatorToAdd);
        
        if (indicator) {
          let explanation = '';
          
          // Provide an explanation based on the indicator type
          switch (indicator.category) {
            case 'momentum':
              explanation = `${indicator.name} is a momentum indicator that helps identify overbought or oversold conditions and potential trend reversals.`;
              break;
            case 'trend':
              explanation = `${indicator.name} is a trend indicator that helps identify the direction and strength of the market trend.`;
              break;
            case 'volatility':
              explanation = `${indicator.name} is a volatility indicator that measures the rate at which prices change, helping identify potential breakouts.`;
              break;
            case 'volume':
              explanation = `${indicator.name} is a volume indicator that analyzes trading volume to confirm price movements and identify potential reversals.`;
              break;
            default:
              explanation = `${indicator.name} can provide additional insights for your technical analysis.`;
          }
          
          response = {
            id: Date.now(),
            text: `I'll add the ${indicator.name} to your chart. ${explanation}`,
            isAI: true,
            timestamp,
            suggestedActions: [
              {
                type: 'add_indicator',
                label: `Add ${indicator.name}`,
                payload: indicator.id
              }
            ],
            addedIndicator: indicator.id
          };
        } else {
          // Handle case where indicator wasn't recognized
          response = {
            id: Date.now(),
            text: `I'm not sure which indicator you're referring to. Here are some popular options:`,
            isAI: true,
            timestamp,
            suggestedActions: [
              { type: 'add_indicator', label: 'Add RSI', payload: 'rsi' },
              { type: 'add_indicator', label: 'Add MACD', payload: 'macd' },
              { type: 'add_indicator', label: 'Add Bollinger Bands', payload: 'bb' },
              { type: 'add_indicator', label: 'Add Volume', payload: 'volume' }
            ]
          };
        }
      } 
      // Analysis-related keywords
      else if (message.toLowerCase().includes('analyze') || message.toLowerCase().includes('what') || message.toLowerCase().includes('trend')) {
        // Model-specific analysis responses
        const modelResponses: Record<string, string> = {
          'trend': `Based on my analysis of ${symbol}, the current trend appears to be bullish with strong support at $64,250. The 50-day moving average is trending upward, suggesting continued momentum. Consider adding the Moving Average indicator for better visualization.`,
          'momentum': `Analyzing ${symbol}, I'm seeing the RSI at 68, approaching overbought territory but not quite there yet. MACD shows a bullish crossover that occurred 3 days ago, indicating positive momentum. Would you like me to add the RSI indicator to monitor potential reversal signals?`,
          'volatility': `Looking at ${symbol}, volatility has been decreasing over the past week. Bollinger Bands are contracting, which often precedes a significant price move. The current price is near the upper band, suggesting potential resistance. I can add Bollinger Bands to the chart for a clearer picture.`,
          'pattern': `I've analyzed ${symbol} and identified a potential cup and handle pattern forming. The neckline is at approximately $65,800. This pattern, if confirmed with a breakout above the neckline, typically suggests continued upward movement. Would you like me to highlight this pattern on the chart?`
        };
        
        response = {
          id: Date.now(),
          text: modelResponses[modelId] || modelResponses['trend'],
          isAI: true,
          timestamp,
          suggestedActions: [
            {
              type: 'add_indicator',
              label: modelId === 'trend' ? 'Add Moving Average' : 
                     modelId === 'momentum' ? 'Add RSI' :
                     modelId === 'volatility' ? 'Add Bollinger Bands' : 'Add Support/Resistance',
              payload: modelId === 'trend' ? 'ma' : 
                       modelId === 'momentum' ? 'rsi' :
                       modelId === 'volatility' ? 'bb' : 'sr'
            }
          ]
        };
      }
      // Show available indicators if asked
      else if (message.toLowerCase().includes('available') && 
              (message.toLowerCase().includes('indicator') || message.toLowerCase().includes('study'))) {
        // Group indicators by category
        const indicatorsByCategory: Record<string, any[]> = {};
        availableIndicators.forEach(indicator => {
          if (!indicatorsByCategory[indicator.category]) {
            indicatorsByCategory[indicator.category] = [];
          }
          indicatorsByCategory[indicator.category].push(indicator);
        });
        
        let indicatorList = 'Here are the available indicators:\n\n';
        
        Object.entries(indicatorsByCategory).forEach(([category, indicators]) => {
          indicatorList += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
          indicators.forEach(indicator => {
            indicatorList += `- ${indicator.name}\n`;
          });
          indicatorList += '\n';
        });
        
        indicatorList += 'You can ask me to add any of these indicators to your chart.';
        
        response = {
          id: Date.now(),
          text: indicatorList,
          isAI: true,
          timestamp,
          suggestedActions: [
            { type: 'add_indicator', label: 'Add RSI', payload: 'rsi' },
            { type: 'add_indicator', label: 'Add MACD', payload: 'macd' },
            { type: 'add_indicator', label: 'Add Bollinger Bands', payload: 'bb' },
            { type: 'add_indicator', label: 'Add Volume', payload: 'volume' }
          ]
        };
      }
      // Default response
      else {
        response = {
          id: Date.now(),
          text: `I'm analyzing ${symbol}. What specific aspect of the chart would you like me to focus on? I can add technical indicators, analyze price patterns, or make predictions based on current data.`,
          isAI: true,
          timestamp,
          suggestedActions: [
            { type: 'add_indicator', label: 'Show Available Indicators', payload: 'list' },
            { type: 'add_indicator', label: 'Add RSI', payload: 'rsi' },
            { type: 'add_indicator', label: 'Add Moving Average', payload: 'ma' },
            { type: 'analyze_chart', label: 'Analyze Current Chart', payload: null }
          ]
        };
      }
      
      // Add remove option for recently added indicators
      if (response.addedIndicator) {
        const indicator = getIndicatorByIdOrName(response.addedIndicator);
        if (indicator && (!response.suggestedActions || response.suggestedActions.length < 3)) {
          response.suggestedActions = [
            ...(response.suggestedActions || []),
            {
              type: 'remove_indicator',
              label: `Remove ${indicator.name}`,
              payload: indicator.id
            }
          ];
        }
      }
      
      resolve(response);
    }, 1000); // 1 second delay to simulate AI processing
  });
};

// Function to store chat history in local storage
export const storeChatHistory = (modelId: string, messages: AIMessage[]): void => {
  try {
    localStorage.setItem(`chat_history_${modelId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing chat history:', error);
  }
};

// Function to get chat history from local storage
export const getChatHistory = (modelId: string): AIMessage[] => {
  try {
    const history = localStorage.getItem(`chat_history_${modelId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
};
