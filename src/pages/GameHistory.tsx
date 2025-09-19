import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  ArrowLeft,
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Coins,
  Filter,
  Download,
  Eye,
  Award,
  Zap,
  Dice1,
  Gift,
} from 'lucide-react';

interface GameHistoryItem {
  id: string;
  gameType: 'lottery' | 'sports' | 'casino' | 'prediction';
  gameName: string;
  betAmount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  result: 'win' | 'loss' | 'pending';
  payout?: number;
  multiplier?: number;
  timestamp: string;
  details: any;
}

interface GameStats {
  totalGames: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
  biggestWin: number;
  longestStreak: number;
  currentStreak: number;
  favoriteGame: string;
  gamesBreakdown: {
    lottery: number;
    sports: number;
    casino: number;
    prediction: number;
  };
}

const GameHistory: React.FC = () => {
  const { user } = useAuth();
  const { gamingStats } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'statistics' | 'achievements'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [selectedGameType, setSelectedGameType] = useState<'all' | 'lottery' | 'sports' | 'casino' | 'prediction'>('all');
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    totalWagered: 0,
    totalWon: 0,
    netProfit: 0,
    winRate: 0,
    biggestWin: 0,
    longestStreak: 0,
    currentStreak: 0,
    favoriteGame: 'lottery',
    gamesBreakdown: { lottery: 0, sports: 0, casino: 0, prediction: 0 }
  });

  useEffect(() => {
    // Mock game history data
    const mockHistory: GameHistoryItem[] = [
      {
        id: 'game_1',
        gameType: 'lottery',
        gameName: 'Daily Draw',
        betAmount: 0.0001,
        currency: 'BTC',
        result: 'win',
        payout: 0.0005,
        multiplier: 5,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: { numbers: [12, 25, 33, 41, 47, 52] }
      },
      {
        id: 'game_2',
        gameType: 'sports',
        gameName: 'Lakers vs Warriors',
        betAmount: 0.002,
        currency: 'BTC',
        result: 'loss',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        details: { betType: 'home_win', odds: 2.25 }
      },
      {
        id: 'game_3',
        gameType: 'casino',
        gameName: 'Lucky Dice',
        betAmount: 50,
        currency: 'VEST',
        result: 'win',
        payout: 200,
        multiplier: 4,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        details: { diceResult: [6, 6], target: 10 }
      },
      {
        id: 'game_4',
        gameType: 'sports',
        gameName: 'Combo Bet (3 matches)',
        betAmount: 0.001,
        currency: 'BTC',
        result: 'pending',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        details: { matches: 3, combinedOdds: 15.6 }
      }
    ];
    setGameHistory(mockHistory);

    // Calculate statistics
    const totalGames = mockHistory.length;
    const totalWagered = mockHistory.reduce((sum, game) => {
      if (game.currency === 'BTC') return sum + game.betAmount;
      if (game.currency === 'VEST') return sum + (game.betAmount * 0.00015); // Mock conversion
      return sum + (game.betAmount * 0.0004); // ETH conversion
    }, 0);
    
    const winGames = mockHistory.filter(g => g.result === 'win');
    const totalWon = winGames.reduce((sum, game) => {
      if (!game.payout) return sum;
      if (game.currency === 'BTC') return sum + game.payout;
      if (game.currency === 'VEST') return sum + (game.payout * 0.00015);
      return sum + (game.payout * 0.0004);
    }, 0);

    setStats({
      totalGames,
      totalWagered,
      totalWon,
      netProfit: totalWon - totalWagered,
      winRate: totalGames > 0 ? (winGames.length / totalGames) * 100 : 0,
      biggestWin: Math.max(...winGames.map(g => g.payout || 0)),
      longestStreak: 3,
      currentStreak: 1,
      favoriteGame: 'lottery',
      gamesBreakdown: {
        lottery: mockHistory.filter(g => g.gameType === 'lottery').length,
        sports: mockHistory.filter(g => g.gameType === 'sports').length,
        casino: mockHistory.filter(g => g.gameType === 'casino').length,
        prediction: mockHistory.filter(g => g.gameType === 'prediction').length,
      }
    });
  }, []);

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'lottery': return <Gift className="w-5 h-5 text-yellow-400" />;
      case 'sports': return <Target className="w-5 h-5 text-green-400" />;
      case 'casino': return <Dice1 className="w-5 h-5 text-purple-400" />;
      case 'prediction': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default: return <Zap className="w-5 h-5 text-crypto-400" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-400';
      case 'loss': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-white/70';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassContainer className="p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
          <p className="text-sm text-white/70">Games Played</p>
        </GlassContainer>
        <GlassContainer className="p-4 text-center">
          <Target className="w-6 h-6 text-crypto-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-crypto-400">{stats.winRate.toFixed(1)}%</p>
          <p className="text-sm text-white/70">Win Rate</p>
        </GlassContainer>
        <GlassContainer className="p-4 text-center">
          <Coins className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(6)} BTC
          </p>
          <p className="text-sm text-white/70">Net Profit</p>
        </GlassContainer>
        <GlassContainer className="p-4 text-center">
          <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
          <p className="text-sm text-white/70">Win Streak</p>
        </GlassContainer>
      </div>

      {/* Games Breakdown */}
      <GlassContainer className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Games Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.gamesBreakdown).map(([game, count]) => (
            <div key={game} className="text-center p-3 glass rounded-lg">
              {getGameIcon(game)}
              <p className="font-bold text-white mt-2">{count}</p>
              <p className="text-sm text-white/70 capitalize">{game}</p>
            </div>
          ))}
        </div>
      </GlassContainer>

      {/* Recent Activity */}
      <GlassContainer className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {gameHistory.slice(0, 5).map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3 glass rounded-lg">
              <div className="flex items-center gap-3">
                {getGameIcon(game.gameType)}
                <div>
                  <p className="font-semibold text-white">{game.gameName}</p>
                  <p className="text-sm text-white/50">{new Date(game.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getResultColor(game.result)}`}>
                  {game.result.toUpperCase()}
                </p>
                <p className="text-sm text-white/70">
                  {game.betAmount} {game.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassContainer>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
        >
          <option value="24h" className="bg-gray-800">Last 24 Hours</option>
          <option value="7d" className="bg-gray-800">Last 7 Days</option>
          <option value="30d" className="bg-gray-800">Last 30 Days</option>
          <option value="all" className="bg-gray-800">All Time</option>
        </select>
        
        <select
          value={selectedGameType}
          onChange={(e) => setSelectedGameType(e.target.value as any)}
          className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
        >
          <option value="all" className="bg-gray-800">All Games</option>
          <option value="lottery" className="bg-gray-800">Lottery</option>
          <option value="sports" className="bg-gray-800">Sports</option>
          <option value="casino" className="bg-gray-800">Casino</option>
          <option value="prediction" className="bg-gray-800">Prediction</option>
        </select>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {gameHistory
          .filter(game => selectedGameType === 'all' || game.gameType === selectedGameType)
          .map((game) => (
          <GlassContainer key={game.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getGameIcon(game.gameType)}
                <div>
                  <h4 className="font-semibold text-white">{game.gameName}</h4>
                  <p className="text-sm text-white/70">{new Date(game.timestamp).toLocaleString()}</p>
                  <p className="text-xs text-white/50">
                    Bet: {game.betAmount} {game.currency}
                    {game.multiplier && ` • ${game.multiplier}x multiplier`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getResultColor(game.result)}`}>
                  {game.result.toUpperCase()}
                </p>
                {game.payout && (
                  <p className="text-green-400 font-semibold">
                    +{game.payout} {game.currency}
                  </p>
                )}
              </div>
            </div>
          </GlassContainer>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassContainer className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/70">Total Wagered:</span>
              <span className="text-white font-semibold">{stats.totalWagered.toFixed(6)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Total Won:</span>
              <span className="text-green-400 font-semibold">{stats.totalWon.toFixed(6)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Net Profit:</span>
              <span className={`font-semibold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(6)} BTC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">ROI:</span>
              <span className={`font-semibold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalWagered > 0 ? ((stats.netProfit / stats.totalWagered) * 100).toFixed(2) : '0'}%
              </span>
            </div>
          </div>
        </GlassContainer>

        <GlassContainer className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Game Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/70">Favorite Game:</span>
              <span className="text-crypto-400 font-semibold capitalize">{stats.favoriteGame}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Biggest Win:</span>
              <span className="text-yellow-400 font-semibold">{stats.biggestWin} VEST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Longest Streak:</span>
              <span className="text-purple-400 font-semibold">{stats.longestStreak} wins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Current Streak:</span>
              <span className="text-blue-400 font-semibold">{stats.currentStreak} wins</span>
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/gaming">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button p-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                📊 <span className="bg-gradient-to-r from-crypto-400 to-purple-500 bg-clip-text text-transparent">
                  Game History & Stats
                </span>
              </h1>
              <p className="text-white/70">Track your gaming performance and statistics</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button p-2"
          >
            <Download className="w-5 h-5 text-crypto-400" />
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-black/20 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'statistics', label: 'Statistics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-crypto-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'statistics' && renderStatistics()}
        </motion.div>
      </div>
    </div>
  );
};

export default GameHistory;