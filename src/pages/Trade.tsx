import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bitcoin,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Wallet,
} from 'lucide-react';

const Trade: React.FC = () => {
  const { portfolio } = useAppStore();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000,
      change: 1200,
      changePercent: 2.74,
      icon: '₿',
      volume: '28.5B',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2250,
      change: 50,
      changePercent: 2.27,
      icon: 'Ξ',
      volume: '12.3B',
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 285,
      change: -5.2,
      changePercent: -1.79,
      icon: '◊',
      volume: '1.8B',
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.42,
      change: 0.015,
      changePercent: 3.7,
      icon: '⟐',
      volume: '890M',
    },
  ];

  const selectedCryptoData = cryptos.find(c => c.symbol === selectedCrypto) || cryptos[0];

  const handleTrade = () => {
    // Mock trade execution
    alert(`${tradeType.toUpperCase()} order submitted for ${amount} ${selectedCrypto}`);
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Trading Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-crypto-400" />
            Trade Cryptocurrencies
          </h1>
          <p className="text-white/70 text-lg">
            Buy and sell cryptocurrencies with real-time market data and instant execution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crypto Selection */}
          <div className="lg:col-span-2">
            <GlassContainer animationDelay={0.1}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-bitcoin" />
                  Select Cryptocurrency
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cryptos.map((crypto, index) => (
                    <motion.button
                      key={crypto.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCrypto(crypto.symbol)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedCrypto === crypto.symbol
                          ? 'bg-crypto-500/20 border-crypto-500 text-white'
                          : 'glass border-white/20 text-white/80 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center text-white font-bold">
                            {crypto.icon}
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold">{crypto.name}</h3>
                            <p className="text-sm opacity-70">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          crypto.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {crypto.changePercent >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {crypto.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold">
                            ${crypto.price.toLocaleString()}
                          </p>
                          <p className="text-sm opacity-70">
                            Vol: {crypto.volume}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Price Chart Placeholder */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {selectedCryptoData.name} Price Chart
                  </h3>
                  <div className="h-64 glass rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white/70">Interactive price chart coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* Trading Panel */}
          <div>
            <GlassContainer animationDelay={0.3}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-crypto-400" />
                  Place Order
                </h2>

                {/* Trade Type Selector */}
                <div className="flex gap-2 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tradeType === 'buy'
                        ? 'bg-green-500 text-white'
                        : 'glass-button text-white/70'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Buy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={ { scale: 0.98 }}
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tradeType === 'sell'
                        ? 'bg-red-500 text-white'
                        : 'glass-button text-white/70'
                    }`}
                  >
                    <Wallet className="w-4 h-4 inline mr-2" />
                    Sell
                  </motion.button>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                  >
                    <option value="market" className="bg-gray-900">Market Order</option>
                    <option value="limit" className="bg-gray-900">Limit Order</option>
                  </select>
                </div>

                {/* Current Price Display */}
                <div className="glass p-4 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Current Price</span>
                    <span className="text-white font-bold text-lg">
                      ${selectedCryptoData.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">
                    Amount ({selectedCrypto})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                  />
                </div>

                {/* Total Cost */}
                {amount && (
                  <div className="glass p-4 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Total Cost</span>
                      <span className="text-white font-bold text-lg">
                        ${(parseFloat(amount || '0') * selectedCryptoData.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {['0.01', '0.1', '0.5', '1'].map((quickAmount) => (
                    <motion.button
                      key={quickAmount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAmount(quickAmount)}
                      className="glass-button py-2 text-sm text-white/70 hover:text-white"
                    >
                      {quickAmount}
                    </motion.button>
                  ))}
                </div>

                {/* Balance Info */}
                <div className="glass p-4 rounded-xl mb-6">
                  <h4 className="text-white font-medium mb-2">Available Balance</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/70">USD</span>
                      <span className="text-white">$10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">{selectedCrypto}</span>
                      <span className="text-white">
                        {portfolio?.assets.find(a => a.symbol === selectedCrypto)?.quantity || 0} {selectedCrypto}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trade Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTrade}
                  disabled={!amount}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    tradeType === 'buy'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto}
                </motion.button>

                {/* Disclaimer */}
                <p className="text-white/50 text-xs mt-4 text-center">
                  Trading involves risk. Only invest what you can afford to lose.
                </p>
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;