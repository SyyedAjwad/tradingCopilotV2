
import React from 'react';
import { ArrowDown, User, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-14 border-b border-divider bg-panel-bg flex items-center justify-between px-4 z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold mr-1">TradeCoPilot</h1>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">Beta</span>
        </div>
        
        <div className="hidden md:flex items-center bg-tool-bg rounded px-2 py-1.5">
          <span className="text-sm font-medium mr-1">BTC/USDT</span>
          <ArrowDown size={14} className="text-text-secondary" />
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Dashboard</button>
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Markets</button>
          <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Signals</button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1 bg-tool-bg rounded px-2 py-1.5">
          <span className="text-up text-sm font-medium">$65,432.10</span>
          <span className="text-up text-xs">+1.34%</span>
        </div>
        
        <button className="icon-button">
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
