import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store';
import { useNotifications } from '../components/NotificationSystem';
import { cryptoAPI } from '../utils/cryptoAPI';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  Zap,
  Lock,
  BarChart3,
  Target,
  Coins,
} from 'lucide-react';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { portfolio, setPortfolio } = useAppStore();
  const { showNotification } = useNotifications();
  const [topCryptos, setTopCryptos] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real crypto prices
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real crypto prices
        const prices = await cryptoAPI.getCurrentPrices();
        const cryptoArray = Object.values(prices).map(crypto => ({
          symbol: crypto.symbol,
          name: crypto.name,
          price: crypto.current_price,
          change: crypto.price_change_24h,
          changePercent: crypto.price_change_percentage_24h,
          icon: crypto.image,
        }));
        
        setTopCryptos(cryptoArray);

        // Show welcome notification for new users
        if (user) {
          showNotification({
            type: 'success',
            title: 'Welcome to CryptoVest!',
            message: 'Your dashboard is now ready with real-time crypto data.',
          });
        }

        // Set mock portfolio data with real prices
        setPortfolio({
          id: '1',
          userId: user?.id || '1',
          totalValue: 45420.50,
          totalInvested: 40000,
          totalReturn: 5420.50,
          totalReturnPercent: 13.55,
          assets: [
            {
              symbol: 'BTC',
              name: 'Bitcoin',
              quantity: 0.75,
              averagePrice: 42000,
              currentPrice: prices.BTC?.current_price || 45000,
              value: (prices.BTC?.current_price || 45000) * 0.75,
              change24h: prices.BTC?.price_change_24h || 1200,
              change24hPercent: prices.BTC?.price_change_percentage_24h || 2.74,
            },
            {
              symbol: 'ETH',
              name: 'Ethereum',
              quantity: 5.2,
              averagePrice: 2100,
              currentPrice: prices.ETH?.current_price || 2250,
              value: (prices.ETH?.current_price || 2250) * 5.2,
              change24h: prices.ETH?.price_change_24h || 50,
              change24hPercent: prices.ETH?.price_change_percentage_24h || 2.27,
            },
          ],
          lastUpdated: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        showNotification({
          type: 'warning',
          title: 'Data Loading Issue',
          message: 'Using demo data while we resolve connection issues.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time price updates
    const cleanup = cryptoAPI.subscribeToPriceUpdates((prices) => {
      const cryptoArray = Object.values(prices).map(crypto => ({
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.current_price,
        change: crypto.price_change_24h,
        changePercent: crypto.price_change_percentage_24h,
        icon: crypto.image,
      }));
      
      setTopCryptos(cryptoArray);
      
      // Update portfolio with new prices
      if (portfolio) {
        const updatedAssets = portfolio.assets.map(asset => {
          const newPrice = prices[asset.symbol]?.current_price || asset.currentPrice;
          return {
            ...asset,
            currentPrice: newPrice,
            value: newPrice * asset.quantity,
            change24h: prices[asset.symbol]?.price_change_24h || asset.change24h,
            change24hPercent: prices[asset.symbol]?.price_change_percentage_24h || asset.change24hPercent,
          };
        });
        
        const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
        
        setPortfolio({
          ...portfolio,
          assets: updatedAssets,
          totalValue: newTotalValue,
          totalReturn: newTotalValue - portfolio.totalInvested,
          totalReturnPercent: ((newTotalValue - portfolio.totalInvested) / portfolio.totalInvested) * 100,
          lastUpdated: new Date().toISOString(),
        });
      }
    });

    return cleanup;
  }, [user, showNotification, setPortfolio]);

  const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string }> = ({
    value,
    prefix = '',
    suffix = '',
  }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (value - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, [value]);

    return (
      <span className="number-counter">
        {prefix}{displayValue.toLocaleString(undefined, { 
          minimumFractionDigits: prefix === '$' ? 2 : 0,
          maximumFractionDigits: prefix === '$' ? 2 : 2 
        })}{suffix}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white text-lg">Loading your dashboard...</span>
          </div>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'Investor'}! 👋
          </h1>
          <p className="text-white/70 text-lg">
            Here's what's happening with your crypto investments today.
          </p>
        </motion.div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassContainer animationDelay={0.1} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">+13.55%</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Total Portfolio Value</h3>
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={portfolio?.totalValue || 0} prefix="$" />
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.2} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">24h</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Today's Gain</h3>
              <p className="text-2xl font-bold text-green-400">
                <AnimatedNumber value={portfolio?.totalReturn || 0} prefix="$" />
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.3} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Active</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Assets</h3>
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={portfolio?.assets.length || 0} />
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.4} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-400 text-sm font-medium">Live</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Market Status</h3>
              <p className="text-lg font-bold text-green-400">BULLISH</p>
            </div>
          </GlassContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Cryptocurrencies */}
          <div className="lg:col-span-2">
            <GlassContainer animationDelay={0.5}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-bitcoin" />
                    Market Overview
                  </h2>
                  <span className="text-green-400 text-sm font-medium">Live Prices</span>
                </div>

                <div className="space-y-4">
                  {topCryptos.map((crypto, index) => (
                    <motion.div
                      key={crypto.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/25 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center text-white font-bold">
                          {crypto.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{crypto.name}</h3>
                          <p className="text-white/60 text-sm">{crypto.symbol}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-bold">
                          ${crypto.price.toLocaleString()}
                        </p>
                        <div className={`flex items-center gap-1 ${
                          crypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {crypto.change >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          <span className="text-sm font-medium">
                            {crypto.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* Quick Actions */}
          <div>
            <GlassContainer animationDelay={0.7}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/trade'}
                    className="w-full glass-button p-4 text-left hover:bg-green-500/20 border-green-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Buy Crypto</h3>
                        <p className="text-white/60 text-sm">Start investing today</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/vesting'}
                    className="w-full glass-button p-4 text-left hover:bg-purple-500/20 border-purple-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Start Vesting</h3>
                        <p className="text-white/60 text-sm">Lock & earn guaranteed returns</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/earn'}
                    className="w-full glass-button p-4 text-left hover:bg-yellow-500/20 border-yellow-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Earn Crypto</h3>
                        <p className="text-white/60 text-sm">Watch videos & social tasks</p>
                      </div>
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full ml-auto">NEW</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/staking'}
                    className="w-full glass-button p-4 text-left hover:bg-cyan-500/20 border-cyan-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Stake Crypto</h3>
                        <p className="text-white/60 text-sm">Earn passive rewards</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/portfolio'}
                    className="w-full glass-button p-4 text-left hover:bg-blue-500/20 border-blue-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">View Portfolio</h3>
                        <p className="text-white/60 text-sm">Track performance</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/analytics'}
                    className="w-full glass-button p-4 text-left hover:bg-orange-500/20 border-orange-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">View Analytics</h3>
                        <p className="text-white/60 text-sm">Performance insights</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;