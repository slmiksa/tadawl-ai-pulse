import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStocksList } from '@/hooks/useStocksList';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock?: (stock: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectStock }) => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { stocks: usStocks } = useStocksList('us');
  const { stocks: saudiStocks } = useStocksList('saudi');
  
  const allStocks = useMemo(() => [...usStocks, ...saudiStocks], [usStocks, saudiStocks]);
  
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return [] as any[];
    return allStocks
      .filter((stock) =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [searchQuery, allStocks]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);


  const handleStockClick = (stock: any) => {
    if (onSelectStock) {
      onSelectStock(stock);
    }
    onClose();
    setSearchQuery('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{t('common.search')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-gray-700 border border-gray-600 rounded-lg py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() && filteredStocks.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              {t('search.noResults')}
            </div>
          )}
          
          {filteredStocks.length > 0 && (
            <div className="p-4 pt-0">
              <div className="space-y-2">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock)}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="text-white font-semibold">{stock.symbol}</h4>
                        <p className="text-gray-400 text-sm">{stock.name}</p>
                      </div>
                    </div>
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-white font-semibold">
                        {stock.market === 'us' ? `$${stock.price.toFixed(2)}` : `${stock.price.toFixed(2)} ر.س`}
                      </p>
                      <p className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Popular Stocks */}
        {!searchQuery.trim() && (
          <div className="p-4 pt-0">
            <h4 className="text-gray-400 text-sm font-medium mb-3">{t('search.popular')}</h4>
            <div className="space-y-2">
              {allStocks
                .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                .slice(0, 5)
                .map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock)}
                    className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="text-white font-semibold">{stock.symbol}</h4>
                        <p className="text-gray-400 text-sm">{stock.name}</p>
                      </div>
                    </div>
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-white font-semibold">
                        {stock.market === 'us' ? `$${stock.price.toFixed(2)}` : `${stock.price.toFixed(2)} ر.س`}
                      </p>
                      <p className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;