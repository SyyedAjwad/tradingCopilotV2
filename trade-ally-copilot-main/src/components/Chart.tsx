import React, { useEffect, useRef, useState } from "react";
import { availableIndicators, tradingPairs } from "@/services/chartService";

interface ChartProps {
  onChartReady?: (widget: any) => void;
  studies?: string[];
  symbol?: string;
}

const Chart: React.FC<ChartProps> = ({
  onChartReady,
  studies = [],
  symbol = "BINANCE:BTCUSDT",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const widgetRef = useRef<any>(null);

  // Effect for initializing the TradingView widget
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing widget if it exists
    if (widgetRef.current) {
      containerRef.current.innerHTML = "";
      widgetRef.current = null;
    }

    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    // If the script doesn't exist yet, create it
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Function to initialize widget once TV library is loaded
    const initWidget = () => {
      if (typeof window.TradingView !== "undefined" && containerRef.current) {
        // Create a new widget configuration
        const widgetOptions = {
          container_id: "tradingview-widget",
          width: "100%",
          height: "100%",
          symbol: symbol,
          interval: "60", // 1h
          timezone: "Etc/UTC",
          theme: "dark" as const,
          style: "1", // Candlestick chart
          locale: "en",
          toolbar_bg: "#131722",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          calendar: false,
          studies: studies,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_volume: false,
          withdateranges: true,
          bottom_toolbar: true,
          save_image: false,
          // Additional customization options for matching mockup
          disabled_features: [
            "header_symbol_search",
            "header_screenshot",
            "header_compare",
            "control_bar",
            "border_around_the_chart",
          ],
          enabled_features: [
            "use_localstorage_for_settings",
            "side_toolbar_in_fullscreen_mode",
          ],
          overrides: {
            "paneProperties.background": "#0e1016",
            "paneProperties.vertGridProperties.color": "#1e222d",
            "paneProperties.horzGridProperties.color": "#1e222d",
            "scalesProperties.backgroundColor": "#0e1016",
          },
        };

        try {
          // Create the widget
          const widget = new window.TradingView.widget(widgetOptions);

          // Store the widget in a ref for later use
          widgetRef.current = widget;

          // Set up the onChartReady event handler
          const originalOnReady = widget.onChartReady;
          widget.onChartReady = function (...args: any[]) {
            console.log("Chart is ready");
            setIsChartLoaded(true);

            // Call the original onChartReady if it exists
            if (typeof originalOnReady === "function") {
              originalOnReady.apply(this, args);
            }

            // Notify parent component that chart is ready
            if (onChartReady) {
              onChartReady(widget);
            }
          };
        } catch (error) {
          console.error("Error initializing TradingView widget:", error);
        }
      }
    };

    // If TradingView is already defined, initialize the widget
    if (typeof window.TradingView !== "undefined") {
      initWidget();
    } else {
      // Otherwise, wait for the script to load
      script.onload = initWidget;
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [onChartReady, symbol]); // Don't include studies in the dependency array to prevent re-initialization

  // Effect for handling study/indicator changes
  useEffect(() => {
    const updateStudies = async () => {
      // Only proceed if chart is loaded and we have a widget
      if (!isChartLoaded || !widgetRef.current) return;

      console.log("Updating studies:", studies);

      try {
        // For a real implementation, we would use widget.chart().getAllStudies()
        // to get current studies, then add/remove as needed
        console.log("Applied studies:", studies);
      } catch (error) {
        console.error("Error updating studies:", error);
      }
    };

    updateStudies();
  }, [isChartLoaded, studies]);

  return (
    <div className="chart-container">
      <div
        id="tradingview-widget"
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default Chart;
