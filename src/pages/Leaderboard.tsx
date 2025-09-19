import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Trophy,
  Crown,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Coins,
  Zap,
  Fire,
  Target,
  Users,
  Calendar,
  Clock,
  Medal,
  Gift,
  ArrowLeft,
  Filter,
  RefreshCw,
  Flame,
  Gem,
  Shield,
} from 'lucide-react';

interface LeaderboardPlayer {
  rank: number;
  previousRank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  level: number;
  xp: number;
  totalEarned: {
    BTC: number;
    ETH: number;
    VEST: number;
  };
  streak: number;
  achievements: number;
  gamesPlayed: number;
  winRate: number;
  totalWagered: number;
  netProfit: number;
  joinedDate: string;
  lastActive: string;
  badges: ('vip' | 'whale' | 'winner' | 'streaker' | 'explorer')[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface LeaderboardFilters {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category: 'overall' | 'earnings' | 'gaming' | 'social' | 'trading';
  tier: 'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { leaderboard, gamingStats, setLeaderboard } = useAppStore();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardPlayer | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    period: 'weekly',
    category: 'overall',
    tier: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLeaderboardData();
  }, [filters]);

  const loadLeaderboardData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPlayers: LeaderboardPlayer[] = [
        {
          rank: 1,
          previousRank: 2,
          userId: 'user1',
          userName: 'CryptoKing',
          avatar: '👑',
          score: 15750,
          level: 25,
          xp: 15750,
          totalEarned: { BTC: 0.15, ETH: 2.5, VEST: 5000 },
          streak: 15,
          achievements: 23,
          gamesPlayed: 156,
          winRate: 68.5,
          totalWagered: 2.5,
          netProfit: 0.85,
          joinedDate: '2024-01-15',
          lastActive: new Date().toISOString(),
          badges: ['vip', 'whale', 'winner', 'streaker'],
          tier: 'diamond'
        },
        {
          rank: 2,
          previousRank: 1,
          userId: 'user2',
          userName: 'BitcoinMaster',
          avatar: '⚡',
          score: 14890,
          level: 23,
          xp: 14890,
          totalEarned: { BTC: 0.12, ETH: 2.1, VEST: 4200 },
          streak: 12,
          achievements: 19,
          gamesPlayed: 134,
          winRate: 71.2,
          totalWagered: 2.1,
          netProfit: 0.65,
          joinedDate: '2024-01-20',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          badges: ['whale', 'winner'],
          tier: 'platinum'
        },
        {
          rank: 3,
          previousRank: 4,
          userId: 'user3',
          userName: 'EthereumQueen',
          avatar: '💎',
          score: 13245,
          level: 21,
          xp: 13245,
          totalEarned: { BTC: 0.08, ETH: 3.2, VEST: 3800 },
          streak: 8,
          achievements: 17,
          gamesPlayed: 89,
          winRate: 65.4,
          totalWagered: 1.8,
          netProfit: 0.45,
          joinedDate: '2024-02-01',
          lastActive: new Date(Date.now() - 7200000).toISOString(),
          badges: ['winner', 'explorer'],
          tier: 'gold'
        },
        {
          rank: 4,
          previousRank: 3,
          userId: 'user4',
          userName: 'VestInvestor',
          avatar: '🚀',
          score: 11890,
          level: 19,
          xp: 11890,
          totalEarned: { BTC: 0.06, ETH: 1.8, VEST: 6500 },
          streak: 22,
          achievements: 15,
          gamesPlayed: 78,
          winRate: 59.8,
          totalWagered: 1.5,
          netProfit: 0.35,
          joinedDate: '2024-02-10',
          lastActive: new Date(Date.now() - 10800000).toISOString(),
          badges: ['streaker', 'explorer'],
          tier: 'gold'
        },
        {
          rank: 5,
          previousRank: 6,
          userId: 'user5',
          userName: 'GamingPro',
          avatar: '🎮',
          score: 10567,
          level: 17,
          xp: 10567,
          totalEarned: { BTC: 0.04, ETH: 1.2, VEST: 2800 },
          streak: 5,
          achievements: 12,
          gamesPlayed: 234,
          winRate: 52.1,
          totalWagered: 3.2,
          netProfit: 0.25,
          joinedDate: '2024-02-15',
          lastActive: new Date(Date.now() - 14400000).toISOString(),
          badges: ['explorer'],
          tier: 'silver'
        }
      ];

      // Add more players to fill the leaderboard
      for (let i = 6; i <= 50; i++) {
        mockPlayers.push({
          rank: i,
          previousRank: i + Math.floor(Math.random() * 3) - 1,
          userId: `user${i}`,
          userName: `Player${i}`,
          avatar: ['🎯', '⭐', '🔥', '💫', '🌟'][Math.floor(Math.random() * 5)],
          score: Math.floor(Math.random() * 8000) + 2000,
          level: Math.floor(Math.random() * 15) + 5,
          xp: Math.floor(Math.random() * 8000) + 2000,
          totalEarned: {
            BTC: Math.random() * 0.05,
            ETH: Math.random() * 1.5,
            VEST: Math.floor(Math.random() * 3000) + 500
          },
          streak: Math.floor(Math.random() * 10),
          achievements: Math.floor(Math.random() * 15) + 3,
          gamesPlayed: Math.floor(Math.random() * 100) + 20,
          winRate: Math.random() * 40 + 40,
          totalWagered: Math.random() * 2,
          netProfit: Math.random() * 0.5,
          joinedDate: '2024-03-01',
          lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          badges: [],
          tier: ['bronze', 'silver', 'gold'][Math.floor(Math.random() * 3)] as any
        });
      }

      setPlayers(mockPlayers);

      // Find current user's rank
      if (user) {
        const currentUserRank = mockPlayers.find(p => p.userId === user.id) || {
          rank: 156,
          previousRank: 160,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          avatar: '🆕',
          score: 450,
          level: 3,
          xp: 450,
          totalEarned: { BTC: 0.001, ETH: 0.05, VEST: 100 },
          streak: 2,
          achievements: 2,
          gamesPlayed: 5,
          winRate: 40,
          totalWagered: 0.1,
          netProfit: 0.01,
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString(),
          badges: [],
          tier: 'bronze' as const
        };
        setUserRank(currentUserRank);
      }

      setIsLoading(false);
    }, 1000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-purple-400';
      case 'diamond': return 'text-cyan-400';
      default: return 'text-white';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Medal className="w-4 h-4" />;
      case 'silver': return <Award className="w-4 h-4" />;
      case 'gold': return <Trophy className="w-4 h-4" />;
      case 'platinum': return <Crown className="w-4 h-4" />;
      case 'diamond': return <Gem className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
    return <span className="text-white font-bold text-sm">#{rank}</span>;
  };

  const getRankChange = (rank: number, previousRank: number) => {
    if (rank < previousRank) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (rank > previousRank) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'vip': return <Crown className="w-3 h-3 text-purple-400" />;
      case 'whale': return <Coins className="w-3 h-3 text-blue-400" />;
      case 'winner': return <Trophy className="w-3 h-3 text-yellow-400" />;
      case 'streaker': return <Fire className="w-3 h-3 text-red-400" />;
      case 'explorer': return <Target className="w-3 h-3 text-green-400" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'VEST') return amount.toFixed(0);
    return amount.toFixed(currency === 'BTC' ? 4 : 3);
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredPlayers = players.filter(player => {
    if (filters.tier !== 'all' && player.tier !== filters.tier) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
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
                🏆 <span className="bg-gradient-to-r from-crypto-400 to-purple-500 bg-clip-text text-transparent">
                  Leaderboard
                </span>
              </h1>
              <p className="text-white/70">Compete with players worldwide</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadLeaderboardData()}
            disabled={isLoading}
            className="glass-button p-2"
          >
            <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </motion.div>

        {/* User Rank Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlassContainer className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-crypto-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {userRank.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{userRank.userName}</h3>
                      <div className="flex items-center gap-1">
                        {userRank.badges.map((badge, i) => (
                          <div key={i} className="w-6 h-6 glass rounded-full flex items-center justify-center">
                            {getBadgeIcon(badge)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <span className="text-crypto-400">Rank #{userRank.rank}</span>
                        {getRankChange(userRank.rank, userRank.previousRank)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Level {userRank.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fire className="w-4 h-4" />
                        {userRank.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-crypto-400">{userRank.score.toLocaleString()}</p>
                  <p className="text-sm text-white/70">Total Score</p>
                </div>
              </div>
            </GlassContainer>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassContainer className="p-6">
            <div className="flex flex-wrap gap-4">
              {/* Period Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/70" />
                <select
                  value={filters.period}
                  onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value as any }))}
                  className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                >
                  <option value="daily" className="bg-gray-800">Daily</option>
                  <option value="weekly" className="bg-gray-800">Weekly</option>
                  <option value="monthly" className="bg-gray-800">Monthly</option>
                  <option value="all_time" className="bg-gray-800">All Time</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/70" />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                  className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                >
                  <option value="overall" className="bg-gray-800">Overall</option>
                  <option value="earnings" className="bg-gray-800">Earnings</option>
                  <option value="gaming" className="bg-gray-800">Gaming</option>
                  <option value="social" className="bg-gray-800">Social</option>
                  <option value="trading" className="bg-gray-800">Trading</option>
                </select>
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-white/70" />
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value as any }))}
                  className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                >
                  <option value="all" className="bg-gray-800">All Tiers</option>
                  <option value="bronze" className="bg-gray-800">Bronze</option>
                  <option value="silver" className="bg-gray-800">Silver</option>
                  <option value="gold" className="bg-gray-800">Gold</option>
                  <option value="platinum" className="bg-gray-800">Platinum</option>
                  <option value="diamond" className="bg-gray-800">Diamond</option>
                </select>
              </div>
            </div>
          </GlassContainer>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassContainer className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-crypto-400" />
              Top Players ({filters.period.replace('_', ' ').toUpperCase()})
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-white/70">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredPlayers.slice(0, 50).map((player, index) => (
                    <motion.div
                      key={player.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className={`p-4 glass rounded-xl border-2 transition-all hover:border-crypto-400/50 ${
                        player.rank <= 3 ? 'border-yellow-400/30 bg-gradient-to-r from-yellow-400/5 to-transparent' :
                        player.rank <= 10 ? 'border-purple-400/30 bg-gradient-to-r from-purple-400/5 to-transparent' :
                        'border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Rank & Player Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center">
                              {getRankIcon(player.rank)}
                            </div>
                            {getRankChange(player.rank, player.previousRank)}
                          </div>
                          
                          <div className="w-12 h-12 bg-gradient-to-br from-crypto-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                            {player.avatar}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white">{player.userName}</h3>
                              <div className={`flex items-center gap-1 text-xs ${getTierColor(player.tier)}`}>
                                {getTierIcon(player.tier)}
                                {player.tier.toUpperCase()}
                              </div>
                              <div className="flex items-center gap-1">
                                {player.badges.slice(0, 3).map((badge, i) => (
                                  <div key={i} className="w-5 h-5 glass rounded-full flex items-center justify-center">
                                    {getBadgeIcon(badge)}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/70">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Lv.{player.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <Fire className="w-3 h-3" />
                                {player.streak}d
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {player.achievements}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getTimeAgo(player.lastActive)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                          {/* Earnings */}
                          <div className="text-right">
                            <p className="text-sm font-bold text-crypto-400">
                              {formatCurrency(player.totalEarned.BTC, 'BTC')} BTC
                            </p>
                            <p className="text-xs text-white/70">
                              {formatCurrency(player.totalEarned.ETH, 'ETH')} ETH
                            </p>
                            <p className="text-xs text-white/70">
                              {formatCurrency(player.totalEarned.VEST, 'VEST')} VEST
                            </p>
                          </div>

                          {/* Win Rate */}
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{player.winRate.toFixed(1)}%</p>
                            <p className="text-xs text-white/70">Win Rate</p>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-crypto-400">{player.score.toLocaleString()}</p>
                            <p className="text-xs text-white/70">Score</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </GlassContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;