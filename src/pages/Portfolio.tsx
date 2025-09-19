import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  Bitcoin,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const Portfolio: React.FC = () => {
  const { portfolio } = useAppStore();
  const [timeRange, setTimeRange] = useState('7d');

  if (!portfolio) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Portfolio Yet</h2>
            <p className="text-white/70 mb-6">Start investing to see your portfolio here</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-6 py-3 text-white hover:text-crypto-400"
            >
              Start Investing
            </motion.button>
          </div>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Portfolio Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <PieChart className="w-8 h-8 text-crypto-400" />
              Portfolio Overview
            </h1>
            <div className="flex gap-2">
              {['24h', '7d', '30d', '1y'].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    timeRange === range
                      ? 'bg-crypto-500 text-white'
                      : 'glass-button text-white/70 hover:text-white'
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </div>
          <p className="text-white/70 text-lg">
            Track your crypto investments and monitor performance across all assets.
          </p>
        </motion.div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassContainer animationDelay={0.1} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">
                  +{portfolio.totalReturnPercent.toFixed(2)}%
                </span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Total Value</h3>
              <p className="text-3xl font-bold text-white">
                ${portfolio.totalValue.toLocaleString()}
              </p>
              <p className="text-green-400 text-sm mt-1">
                +${portfolio.totalReturn.toLocaleString()} total return
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.2} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Invested</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Total Invested</h3>
              <p className="text-3xl font-bold text-white">
                ${portfolio.totalInvested.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Across {portfolio.assets.length} assets
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.3} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-400 text-sm font-medium">{timeRange}</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Performance</h3>
              <p className="text-3xl font-bold text-green-400">
                +{portfolio.totalReturnPercent.toFixed(1)}%
              </p>
              <p className="text-white/60 text-sm mt-1">
                Above market average
              </p>
            </div>
          </GlassContainer>
        </div>

        {/* Assets List */}
        <GlassContainer animationDelay={0.4}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bitcoin className="w-6 h-6 text-bitcoin" />
                Your Assets
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-4 py-2 text-white hover:text-crypto-400"
              >
                Add Asset
              </motion.button>
            </div>

            <div className="space-y-4">
              {portfolio.assets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/25 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center text-white font-bold">
                      {asset.symbol === 'BTC' ? '₿' : 'Ξ'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{asset.name}</h3>
                      <p className="text-white/60">
                        {asset.quantity.toFixed(4)} {asset.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white font-bold text-lg">
                      ${asset.currentPrice.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-1 justify-center ${
                      asset.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {asset.change24hPercent >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {asset.change24hPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      ${asset.value.toLocaleString()}
                    </p>
                    <p className="text-white/60 text-sm">
                      Avg: ${asset.averagePrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button px-3 py-1 text-green-400 hover:bg-green-500/20 border-green-500/30"
                    >
                      Buy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button px-3 py-1 text-red-400 hover:bg-red-500/20 border-red-500/30"
                    >
                      Sell
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassContainer>

        {/* Portfolio Allocation Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <GlassContainer animationDelay={0.6}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-crypto-400" />
                Asset Allocation
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/70">Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.7}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-crypto-400" />
                Performance History
              </h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/70">Historical charts coming soon</p>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;