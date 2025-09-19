import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Dice1,
  Target,
  Trophy,
  TrendingUp,
  Coins,
  Zap,
  Users,
  Clock,
  Star,
  Play,
  Gift,
  Crown,
  Award,
} from 'lucide-react';

const Gaming: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, gamingStats, leaderboard, setGameWallet, setGamingStats } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'casino' | 'sports' | 'lottery' | 'prediction'>('all');

  useEffect(() => {
    // Initialize game wallet if not exists
    if (user && !gameWallet) {
      const newWallet = {
        id: `wallet_${user.id}`,
        userId: user.id,
        balances: {
          BTC: 0.001, // Demo balance
          ETH: 0.05,
          VEST: 100,
        },
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        lastActivity: new Date().toISOString(),
      };
      setGameWallet(newWallet);
    }

    // Initialize gaming stats
    if (user && !gamingStats) {
      const newStats = {
        userId: user.id,
        totalGamesPlayed: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        netProfit: 0,
        winRate: 0,
        favoriteGame: 'lottery',
        biggestWin: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        achievements: [],
      };
      setGamingStats(newStats);
    }
  }, [user, gameWallet, gamingStats, setGameWallet, setGamingStats]);

  const gameCategories = [
    {
      id: 'casino',
      name: 'Casino Games',
      icon: Dice1,
      description: 'Slots, Dice, Roulette & More',
      color: 'from-purple-500 to-pink-500',
      games: ['Spin the Bottle', 'Lucky Dice', 'Crypto Slots', 'Roulette'],
      path: '/gaming/casino',
    },
    {
      id: 'sports',
      name: 'Sports Betting',
      icon: Target,
      description: 'Live Match Predictions',
      color: 'from-green-500 to-emerald-500',
      games: ['Football', 'Basketball', 'Tennis', 'Cricket'],
      path: '/gaming/sports',
    },
    {
      id: 'lottery',
      name: 'Lottery',
      icon: Gift,
      description: 'Daily & Weekly Draws',
      color: 'from-yellow-500 to-orange-500',
      games: ['Daily Draw', 'Weekly Mega', 'Instant Win'],
      path: '/gaming/lottery',
    },
    {
      id: 'prediction',
      name: 'Prediction Markets',
      icon: TrendingUp,
      description: 'Crypto Price Predictions',
      color: 'from-blue-500 to-cyan-500',
      games: ['Bitcoin Price', 'Market Events', 'Crypto Trends'],
      path: '/gaming/prediction',
    },
  ];

  const quickStats = [
    {
      label: 'Games Played',
      value: gamingStats?.totalGamesPlayed || 0,
      icon: Play,
      color: 'text-blue-400',
    },
    {
      label: 'Total Won',
      value: `${(gamingStats?.totalWon || 0).toFixed(4)} BTC`,
      icon: Trophy,
      color: 'text-green-400',
    },
    {
      label: 'Win Rate',
      value: `${(gamingStats?.winRate || 0).toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-400',
    },
    {
      label: 'Level',
      value: gamingStats?.level || 1,
      icon: Crown,
      color: 'text-yellow-400',
    },
  ];

  const topGames = [
    {
      name: 'Spin the Bottle',
      players: 234,
      prize: '0.05 BTC',
      difficulty: 'Easy',
      icon: '🍾',
    },
    {
      name: 'Lucky Dice',
      players: 189,
      prize: '0.08 BTC',
      difficulty: 'Medium',
      icon: '🎲',
    },
    {
      name: 'Sports Betting',
      players: 156,
      prize: '0.12 BTC',
      difficulty: 'Hard',
      icon: '⚽',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎮 <span className="bg-gradient-to-r from-crypto-400 to-purple-500 bg-clip-text text-transparent">
              Crypto Gaming Hub
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Play, bet, and win with cryptocurrency. Fair games, instant payouts, and endless excitement.
          </p>
        </motion.div>

        {/* Game Wallet */}
        {gameWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassContainer className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Coins className="w-6 h-6 text-crypto-400" />
                  Gaming Wallet
                </h2>
                <div className="flex items-center gap-2">
                  <Link to="/gaming/history">
                    <button className="glass-button px-3 py-1 text-crypto-400 hover:text-white text-sm">
                      📊 History
                    </button>
                  </Link>
                  <Link to="/gaming/wallet">
                    <button className="glass-button px-4 py-2 text-crypto-400 hover:text-white">
                      Manage Wallet
                    </button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-white/70">Bitcoin</p>
                  <p className="text-xl font-bold text-orange-400">
                    {gameWallet.balances.BTC.toFixed(6)} BTC
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/70">Ethereum</p>
                  <p className="text-xl font-bold text-blue-400">
                    {gameWallet.balances.ETH.toFixed(4)} ETH
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/70">VEST Token</p>
                  <p className="text-xl font-bold text-crypto-400">
                    {gameWallet.balances.VEST.toFixed(2)} VEST
                  </p>
                </div>
              </div>
            </GlassContainer>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => (
            <GlassContainer key={stat.label} className="p-4 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-sm text-white/70">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </GlassContainer>
          ))}
        </motion.div>

        {/* Game Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-crypto-400" />
            Game Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={category.path}>
                  <GlassContainer className="p-6 h-full hover:border-crypto-500/50 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{category.description}</p>
                    <div className="space-y-1">
                      {category.games.slice(0, 3).map((game) => (
                        <p key={game} className="text-xs text-white/50">• {game}</p>
                      ))}
                    </div>
                  </GlassContainer>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Games & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Games */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassContainer className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-crypto-400" />
                Popular Games
              </h3>
              <div className="space-y-4">
                {topGames.map((game, index) => (
                  <div key={game.name} className="flex items-center justify-between p-3 glass rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{game.icon}</span>
                      <div>
                        <p className="font-semibold text-white">{game.name}</p>
                        <p className="text-sm text-white/70">{game.players} players</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-crypto-400">{game.prize}</p>
                      <p className="text-xs text-white/50">{game.difficulty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassContainer>
          </motion.div>

          {/* Leaderboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassContainer className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-crypto-400" />
                  Top Players
                </h3>
                <Link to="/gaming/leaderboard">
                  <button className="text-crypto-400 hover:text-white text-sm">View All</button>
                </Link>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 glass rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        rank === 1 ? 'bg-yellow-500 text-black' :
                        rank === 2 ? 'bg-gray-400 text-black' :
                        'bg-orange-500 text-white'
                      }`}>
                        {rank}
                      </div>
                      <div>
                        <p className="font-semibold text-white">Player{rank}</p>
                        <p className="text-sm text-white/70">Level {10 - rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-crypto-400">
                        {(0.1 + (4 - rank) * 0.05).toFixed(3)} BTC
                      </p>
                      <p className="text-xs text-white/50">{95 + rank}% Win Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassContainer>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <GlassContainer className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Gaming?</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Join thousands of players in the ultimate crypto gaming experience. 
              Fair games, instant payouts, and massive rewards await!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/gaming/lottery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-crypto-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-crypto-600 hover:to-purple-700"
                >
                  Play Lottery
                </motion.button>
              </Link>
              <Link to="/gaming/casino">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-8 py-3 text-white hover:text-crypto-400"
                >
                  Try Casino Games
                </motion.button>
              </Link>
            </div>
          </GlassContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Gaming;