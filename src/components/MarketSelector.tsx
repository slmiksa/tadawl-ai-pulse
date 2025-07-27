
import React from 'react';
import { cn } from '@/lib/utils';

interface MarketSelectorProps {
  activeMarket: 'all' | 'us' | 'saudi';
  onMarketChange: (market: 'all' | 'us' | 'saudi') => void;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({ activeMarket, onMarketChange }) => {
  const markets = [
    { id: 'all', label: 'جميع الأسواق', flag: '🌍' },
    { id: 'us', label: 'السوق الأمريكي', flag: '🇺🇸' },
    { id: 'saudi', label: 'السوق السعودي', flag: '🇸🇦' },
  ];

  return (
    <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
      {markets.map((market) => (
        <button
          key={market.id}
          onClick={() => onMarketChange(market.id as 'all' | 'us' | 'saudi')}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeMarket === market.id
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          )}
        >
          <span className="text-lg">{market.flag}</span>
          <span>{market.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MarketSelector;
