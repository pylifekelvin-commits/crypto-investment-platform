import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Award,
  Activity,
  Calendar,
  DollarSign,
  Percent,
  Eye,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { InvestmentAnalytics, PerformanceData } from '../types';

const Analytics: React.FC = () => {
  const { 
    portfolio, 
    vestingPositions, 
    stakingPositions, 
    investmentAnalytics,
    setInvestmentAnalytics 
  } = useAppStore();
  
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock analytics data
  useEffect(() => {
    const generateAnalytics = () => {
      const totalVested = vestingPositions.reduce((sum, pos) => sum + pos.amount, 0);
      const totalStaked = stakingPositions.reduce((sum, pos) => sum + pos.amount, 0);
      const totalRewards = vestingPositions.reduce((sum, pos) => sum + pos.earnedRewards, 0) +
                          stakingPositions.reduce((sum, pos) => sum + pos.earnedRewards, 0);
      
      const portfolioValue = portfolio?.totalValue || 0;
      const totalInvestment = (portfolio?.totalInvested || 0) + totalVested + totalStaked;
      const portfolioGrowth = totalInvestment > 0 ? ((portfolioValue + totalVested + totalStaked - totalInvestment) / totalInvestment) * 100 : 0;

      // Generate performance history (mock data)
      const performanceHistory: PerformanceData[] = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const baseValue = totalInvestment;
        const growth = (Math.sin(i * 0.1) + 1) * 0.1 + (days - i) * 0.002;
        
        performanceHistory.push({
          date: date.toISOString().split('T')[0],
          portfolioValue: baseValue * (1 + growth),
          vestingValue: totalVested * (1 + growth * 0.8),
          stakingValue: totalStaked * (1 + growth * 1.2),
          totalRewards: totalRewards * (i < days ? (days - i) / days : 0)
        });
      }

      const analytics: InvestmentAnalytics = {
        totalVested,
        totalStaked,
        totalRewards,
        portfolioGrowth,
        riskScore: 65, // Mock risk score
        diversificationScore: 78, // Mock diversification score
        performanceHistory
      };

      setInvestmentAnalytics(analytics);
      setIsLoading(false);
    };

    generateAnalytics();
  }, [portfolio, vestingPositions, stakingPositions, timeRange, setInvestmentAnalytics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white text-lg">Analyzing your investments...</span>
          </div>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-crypto-400" />
              Investment Analytics
            </h1>
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex gap-2">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <motion.button
                    key={range}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      timeRange === range
                        ? 'bg-crypto-500 text-white'
                        : 'glass-button text-white/70 hover:text-white'
                    }`}
                  >
                    {range}
                  </motion.button>
                ))}
              </div>
              
              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2 text-white hover:text-crypto-400"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-white/70 text-lg">
            Comprehensive analysis of your investment performance across all platforms.
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassContainer animationDelay={0.1} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Total Value</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Portfolio + Vesting + Staking</h3>
              <p className="text-2xl font-bold text-white">
                {formatCurrency((portfolio?.totalValue || 0) + (investmentAnalytics?.totalVested || 0) + (investmentAnalytics?.totalStaked || 0))}
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.2} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${(investmentAnalytics?.portfolioGrowth ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(investmentAnalytics?.portfolioGrowth ?? 0) >= 0 ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                </span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Portfolio Growth</h3>
              <p className={`text-2xl font-bold ${(investmentAnalytics?.portfolioGrowth ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(investmentAnalytics?.portfolioGrowth || 0)}
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.3} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-400 text-sm font-medium">Rewards</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Total Earned</h3>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(investmentAnalytics?.totalRewards || 0)}
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.4} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-400 text-sm font-medium">Risk</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Risk Score</h3>
              <p className={`text-2xl font-bold ${getScoreColor(investmentAnalytics?.riskScore || 0)}`}>
                {investmentAnalytics?.riskScore || 0}/100
              </p>
            </div>
          </GlassContainer>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <GlassContainer animationDelay={0.5}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-crypto-400" />
                  Performance Overview
                </h2>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Portfolio</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Vesting</span>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Staking</span>
                </div>
              </div>
              
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/70">Interactive charts coming soon</p>
                  <p className="text-white/50 text-sm mt-1">Chart.js integration in progress</p>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Asset Allocation */}
          <GlassContainer animationDelay={0.6}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-crypto-400" />
                  Asset Allocation
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button p-2 text-white hover:text-crypto-400"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Allocation Breakdown */}
              <div className="space-y-4">
                {portfolio?.assets.map((asset, index) => {
                  const percentage = ((asset.value / (portfolio.totalValue || 1)) * 100);
                  return (
                    <div key={asset.symbol} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-crypto-400 to-crypto-600"></div>
                          <span className="text-white font-medium">{asset.name}</span>
                        </div>
                        <span className="text-white/70">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                          className="bg-gradient-to-r from-crypto-400 to-crypto-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Analysis */}
          <GlassContainer animationDelay={0.7}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-crypto-400" />
                Risk Analysis
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Overall Risk</span>
                    <span className={`text-sm font-semibold ${getScoreColor(investmentAnalytics?.riskScore || 0)}`}>
                      {investmentAnalytics?.riskScore || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${investmentAnalytics?.riskScore || 0}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className={`h-2 rounded-full ${
                        (investmentAnalytics?.riskScore || 0) >= 80 ? 'bg-green-500' :
                        (investmentAnalytics?.riskScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Diversification</span>
                    <span className={`text-sm font-semibold ${getScoreColor(investmentAnalytics?.diversificationScore || 0)}`}>
                      {investmentAnalytics?.diversificationScore || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${investmentAnalytics?.diversificationScore || 0}%` }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className={`h-2 rounded-full ${
                        (investmentAnalytics?.diversificationScore || 0) >= 80 ? 'bg-green-500' :
                        (investmentAnalytics?.diversificationScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${getScoreBg(investmentAnalytics?.riskScore || 0)}`}>
                  <p className="text-white text-sm">
                    <strong>Recommendation:</strong> Your portfolio shows {
                      (investmentAnalytics?.riskScore || 0) >= 80 ? 'excellent' :
                      (investmentAnalytics?.riskScore || 0) >= 60 ? 'good' : 'moderate'
                    } risk management. Consider {
                      (investmentAnalytics?.diversificationScore || 0) < 70 ? 'diversifying further' : 'maintaining current allocation'
                    }.
                  </p>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Vesting Summary */}
          <GlassContainer animationDelay={0.8}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-crypto-400" />
                Vesting Overview
              </h3>
              
              <div className="space-y-4">
                <div className="glass p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Total Vested</span>
                    <span className="text-white font-semibold">{formatCurrency(investmentAnalytics?.totalVested || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Active Positions</span>
                    <span className="text-white font-semibold">{vestingPositions.length}</span>
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Avg. APY</span>
                    <span className="text-green-400 font-semibold">12.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Next Unlock</span>
                    <span className="text-white font-semibold">15 days</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Staking Summary */}
          <GlassContainer animationDelay={0.9}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-crypto-400" />
                Staking Overview
              </h3>
              
              <div className="space-y-4">
                <div className="glass p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Total Staked</span>
                    <span className="text-white font-semibold">{formatCurrency(investmentAnalytics?.totalStaked || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Active Stakes</span>
                    <span className="text-white font-semibold">{stakingPositions.length}</span>
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70 text-sm">Daily Rewards</span>
                    <span className="text-green-400 font-semibold">$12.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Auto Compound</span>
                    <span className="text-green-400 font-semibold">ON</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;