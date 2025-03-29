
declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewWidgetConfig) => any;
    };
  }
}

interface TradingViewWidgetConfig {
  container_id: string;
  width: string | number;
  height: string | number;
  symbol: string;
  interval: string;
  timezone?: string;
  theme?: "light" | "dark";
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  hide_top_toolbar?: boolean;
  allow_symbol_change?: boolean;
  save_image?: boolean;
  studies?: string[];
  show_popup_button?: boolean;
  popup_width?: string;
  popup_height?: string;
  [key: string]: any;
}

export {};
