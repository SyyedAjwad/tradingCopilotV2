import React, { useState, useRef } from "react";
import Chart from "./Chart";
import {
  addIndicatorToChart,
  removeIndicatorFromChart,
  getIndicatorByIdOrName,
} from "@/services/chartService";

interface ChartPanelProps {
  onAddIndicator?: (indicatorId: string) => void;
  onRemoveIndicator?: (indicatorId: string) => void;
  onAnalyzeChart?: () => void;
  onSymbolChange?: (symbol: string) => void;
  activeIndicators?: string[];
  currentSymbol?: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({
  onAddIndicator,
  onRemoveIndicator,
  onAnalyzeChart,
  onSymbolChange,
  activeIndicators = [],
  currentSymbol = "BINANCE:BTCUSDT",
}) => {
  const chartWidgetRef = useRef<any>(null);

  const handleChartReady = (widget: any) => {
    chartWidgetRef.current = widget;
    console.log("Chart widget ready in ChartPanel");

    // Set up symbol change event listener
    if (widget && widget.chart && onSymbolChange) {
      widget
        .chart()
        .onSymbolChanged()
        .subscribe(null, (symbolData: any) => {
          if (symbolData && symbolData.name) {
            console.log(`Symbol changed to: ${symbolData.name}`);
            onSymbolChange(symbolData.name);
          }
        });
    }
  };

  const handleAddIndicator = async (indicatorId: string) => {
    if (!chartWidgetRef.current) {
      console.warn("Chart widget not ready yet");
      return;
    }

    console.log(`Attempting to add indicator: ${indicatorId}`);
    const success = await addIndicatorToChart(
      chartWidgetRef.current,
      indicatorId
    );

    if (success && onAddIndicator) {
      const indicator = getIndicatorByIdOrName(indicatorId);
      if (indicator) {
        console.log(`Successfully added indicator: ${indicator.name}`);
        onAddIndicator(indicator.tvStudy);
      }
    }
  };

  const handleRemoveIndicator = async () => {
    if (!chartWidgetRef.current || activeIndicators.length <= 0) {
      console.warn(
        "Cannot remove indicator: Widget not ready or no indicators active"
      );
      return;
    }

    // For simplicity, just remove the last added indicator
    const lastIndicator = activeIndicators[activeIndicators.length - 1];
    const indicator = getIndicatorByIdOrName(lastIndicator);

    if (indicator) {
      console.log(`Attempting to remove indicator: ${indicator.id}`);
      const success = await removeIndicatorFromChart(
        chartWidgetRef.current,
        indicator.id
      );

      if (success && onRemoveIndicator) {
        onRemoveIndicator("last"); // Signal to remove the last indicator
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1016]">
      {/* Note: Removed the Chart Toolbar as it's now handled by TradingView */}
      <div className="flex-1 overflow-hidden">
        <Chart
          onChartReady={handleChartReady}
          studies={activeIndicators}
          symbol={currentSymbol}
        />
      </div>
    </div>
  );
};

export default ChartPanel;
