import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Target,
  Clock,
  Users,
  Trophy,
  Coins,
  Star,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Play,
  Activity,
  Timer,
} from 'lucide-react';

interface MatchData {
  id: string;
  sport: 'football' | 'basketball' | 'tennis' | 'soccer' | 'cricket';
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  odds: {
    homeWin: number;
    awayWin: number;
    draw?: number;
  };
  totalBets: number;
  homeTeamLogo: string;
  awayTeamLogo: string;
  liveTime?: string;
}

const SportsBetting: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, activeBets, sportsMatches, placeSportsBet, updateGameBalance } = useAppStore();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0.001);
  const [selectedBetType, setSelectedBetType] = useState<'home_win' | 'away_win' | 'draw'>('home_win');
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'VEST'>('BTC');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [comboBets, setComboBets] = useState<Array<{matchId: string, betType: 'home_win' | 'away_win' | 'draw', odds: number, matchName: string}>>([]);
  const [betMode, setBetMode] = useState<'single' | 'combo'>('single');

  // Mock sports matches data
  const mockMatches: MatchData[] = [
    {
      id: 'match_1',
      sport: 'football',
      league: 'NFL',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      odds: { homeWin: 1.85, awayWin: 2.10 },
      totalBets: 145,
      homeTeamLogo: '🏈',
      awayTeamLogo: '🦬',
    },
    {
      id: 'match_2',
      sport: 'basketball',
      league: 'NBA',
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      startTime: new Date().toISOString(),
      status: 'live',
      score: { home: 78, away: 82 },
      odds: { homeWin: 2.25, awayWin: 1.75 },
      totalBets: 234,
      homeTeamLogo: '🏀',
      awayTeamLogo: '⚡',
      liveTime: '3rd Quarter - 8:45',
    },
    {
      id: 'match_3',
      sport: 'soccer',
      league: 'Premier League',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      odds: { homeWin: 2.40, awayWin: 2.80, draw: 3.20 },
      totalBets: 189,
      homeTeamLogo: '⚽',
      awayTeamLogo: '🔴',
    },
    {
      id: 'match_4',
      sport: 'tennis',
      league: 'ATP',
      homeTeam: 'Novak Djokovic',
      awayTeam: 'Rafael Nadal',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      odds: { homeWin: 1.95, awayWin: 1.90 },
      totalBets: 98,
      homeTeamLogo: '🎾',
      awayTeamLogo: '🎾',
    },
    {
      id: 'match_5',
      sport: 'cricket',
      league: 'IPL',
      homeTeam: 'Mumbai Indians',
      awayTeam: 'Chennai Super Kings',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'finished',
      score: { home: 187, away: 165 },
      odds: { homeWin: 1.80, awayWin: 2.05 },
      totalBets: 167,
      homeTeamLogo: '🏏',
      awayTeamLogo: '🦁',
    },
  ];

  const sports = [
    { id: 'all', name: 'All Sports', icon: '🏆' },
    { id: 'football', name: 'Football', icon: '🏈' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'soccer', name: 'Soccer', icon: '⚽' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
  ];

  const addToCombo = (match: MatchData, betType: 'home_win' | 'away_win' | 'draw') => {
    const odds = betType === 'home_win' ? match.odds.homeWin :
                 betType === 'away_win' ? match.odds.awayWin :
                 match.odds.draw || 0;
    
    const matchName = `${match.homeTeam} vs ${match.awayTeam}`;
    const betTypeText = betType === 'home_win' ? match.homeTeam :
                        betType === 'away_win' ? match.awayTeam : 'Draw';
    
    // Check if this match is already in combo
    const existingIndex = comboBets.findIndex(bet => bet.matchId === match.id);
    
    if (existingIndex >= 0) {
      // Update existing combo bet
      const updatedComboBets = [...comboBets];
      updatedComboBets[existingIndex] = {
        matchId: match.id,
        betType,
        odds,
        matchName: `${matchName} (${betTypeText})`,
      };
      setComboBets(updatedComboBets);
    } else {
      // Add new combo bet
      if (comboBets.length >= 10) { // Max 10 matches in combo
        alert('Maximum 10 matches allowed in combo bet');
        return;
      }
      
      setComboBets([...comboBets, {
        matchId: match.id,
        betType,
        odds,
        matchName: `${matchName} (${betTypeText})`,
      }]);
    }
  };

  const removeFromCombo = (matchId: string) => {
    setComboBets(comboBets.filter(bet => bet.matchId !== matchId));
  };

  const getCombinedOdds = () => {
    return comboBets.reduce((total, bet) => total * bet.odds, 1);
  };

  const filteredMatches = selectedSport === 'all' 
    ? mockMatches 
    : mockMatches.filter(match => match.sport === selectedSport);

  const handlePlaceBet = async () => {
    if (!user || !gameWallet) return;
    
    if (betMode === 'single') {
      if (!selectedMatch) {
        alert('Please select a match');
        return;
      }
      
      if (gameWallet.balances[selectedCurrency] < betAmount) {
        alert(`Insufficient ${selectedCurrency} balance`);
        return;
      }

      setIsPlacingBet(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const odds = selectedBetType === 'home_win' ? selectedMatch.odds.homeWin :
                     selectedBetType === 'away_win' ? selectedMatch.odds.awayWin :
                     selectedMatch.odds.draw || 0;

        const betId = `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        placeSportsBet({
          id: betId,
          userId: user.id,
          matchId: selectedMatch.id,
          betType: selectedBetType,
          amount: betAmount,
          currency: selectedCurrency,
          odds,
          potentialPayout: betAmount * odds,
          status: 'pending',
          placedAt: new Date().toISOString(),
        });

        // Update balance
        updateGameBalance(selectedCurrency, -betAmount);

        alert(`Single bet placed successfully! Potential payout: ${(betAmount * odds).toFixed(6)} ${selectedCurrency}`);
        
        // Reset form
        setBetAmount(0.001);
        setSelectedMatch(null);
        
      } catch (error) {
        console.error('Error placing bet:', error);
        alert('Failed to place bet. Please try again.');
      } finally {
        setIsPlacingBet(false);
      }
    } else {
      // Combo bet logic
      if (comboBets.length < 2) {
        alert('Please select at least 2 matches for a combo bet');
        return;
      }
      
      if (gameWallet.balances[selectedCurrency] < betAmount) {
        alert(`Insufficient ${selectedCurrency} balance`);
        return;
      }

      setIsPlacingBet(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const combinedOdds = comboBets.reduce((total, bet) => total * bet.odds, 1);
        const potentialPayout = betAmount * combinedOdds;

        const betId = `combo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a combo bet record
        placeSportsBet({
          id: betId,
          userId: user.id,
          matchId: 'combo', // Special identifier for combo bets
          betType: 'combo' as any,
          amount: betAmount,
          currency: selectedCurrency,
          odds: combinedOdds,
          potentialPayout,
          status: 'pending',
          placedAt: new Date().toISOString(),
        });

        // Update balance
        updateGameBalance(selectedCurrency, -betAmount);

        alert(`Combo bet placed successfully! ${comboBets.length} matches combined. Potential payout: ${potentialPayout.toFixed(6)} ${selectedCurrency}`);
        
        // Reset form
        setBetAmount(0.001);
        setComboBets([]);
        
      } catch (error) {
        console.error('Error placing combo bet:', error);
        alert('Failed to place combo bet. Please try again.');
      } finally {
        setIsPlacingBet(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-500/20';
      case 'upcoming': return 'text-blue-400 bg-blue-500/20';
      case 'finished': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-white/70 bg-white/10';
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

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
                ⚽ <span className="bg-gradient-to-r from-crypto-400 to-green-500 bg-clip-text text-transparent">
                  Sports Betting
                </span>
              </h1>
              <p className="text-white/70">Bet on live matches and win crypto</p>
            </div>
          </div>
          {gameWallet && (
            <div className="text-right">
              <p className="text-sm text-white/70">Gaming Wallet</p>
              <p className="text-lg font-bold text-crypto-400">
                {gameWallet.balances.BTC.toFixed(6)} BTC
              </p>
              <p className="text-sm text-white">
                {gameWallet.balances.VEST.toFixed(0)} VEST
              </p>
            </div>
          )}
        </motion.div>

        {/* Sports Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassContainer className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-crypto-400" />
                Sports Categories
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">Bet Mode:</span>
                <div className="flex bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setBetMode('single')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      betMode === 'single'
                        ? 'bg-crypto-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Single Bet
                  </button>
                  <button
                    onClick={() => setBetMode('combo')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      betMode === 'combo'
                        ? 'bg-crypto-500 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Combo Bet
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {sports.map((sport) => (
                <motion.button
                  key={sport.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                    selectedSport === sport.id
                      ? 'border-crypto-400 bg-crypto-500/20 text-white'
                      : 'border-white/20 hover:border-crypto-400/50 text-white/70'
                  }`}
                >
                  <span className="text-lg">{sport.icon}</span>
                  <span className="font-semibold">{sport.name}</span>
                </motion.button>
              ))}
            </div>
            {betMode === 'combo' && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                <p className="text-sm text-white/70 mb-2">🎯 <strong>Combo Bet Mode:</strong> Select multiple matches to multiply your odds!</p>
                <p className="text-xs text-white/50">• Click on match odds to add to combo • Minimum 2 matches • Maximum 10 matches • Higher risk, higher rewards!</p>
              </div>
            )}
          </GlassContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matches List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassContainer className="p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-crypto-400" />
                  Live & Upcoming Matches
                </h2>
                
                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => betMode === 'single' && setSelectedMatch(match)}
                      className={`p-4 glass rounded-xl transition-all border relative ${
                        selectedMatch?.id === match.id && betMode === 'single'
                          ? 'border-crypto-400 bg-crypto-500/10 cursor-pointer'
                          : betMode === 'single'
                          ? 'border-white/10 hover:border-crypto-400/50 cursor-pointer'
                          : 'border-white/10'
                      }`}
                    >
                      {betMode === 'combo' && comboBets.some(bet => bet.matchId === match.id) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          ✓ IN COMBO
                        </div>
                      )}
                      {/* Match Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(match.status)}`}>
                            {match.status === 'live' && <Activity className="w-3 h-3 inline mr-1" />}
                            {match.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-white/70">{match.league}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50">Total Bets</p>
                          <p className="text-sm font-semibold text-crypto-400">{match.totalBets}</p>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="grid grid-cols-3 gap-4 items-center mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">{match.homeTeamLogo}</div>
                          <p className="font-semibold text-white text-sm">{match.homeTeam}</p>
                          {match.score && (
                            <p className="text-xl font-bold text-crypto-400">{match.score.home}</p>
                          )}
                        </div>
                        
                        <div className="text-center">
                          {match.status === 'live' && match.liveTime ? (
                            <div>
                              <p className="text-xs text-green-400 mb-1">LIVE</p>
                              <p className="text-xs text-white/70">{match.liveTime}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs text-white/50 mb-1">
                                {match.status === 'finished' ? 'Final' : 'Starts'}
                              </p>
                              <p className="text-xs text-white/70">{formatTime(match.startTime)}</p>
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">{match.awayTeamLogo}</div>
                          <p className="font-semibold text-white text-sm">{match.awayTeam}</p>
                          {match.score && (
                            <p className="text-xl font-bold text-crypto-400">{match.score.away}</p>
                          )}
                        </div>
                      </div>

                      {/* Odds */}
                      <div className="grid grid-cols-3 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (betMode === 'single') {
                              setSelectedMatch(match);
                              setSelectedBetType('home_win');
                            } else {
                              addToCombo(match, 'home_win');
                            }
                          }}
                          disabled={match.status === 'finished'}
                          className={`text-center p-2 glass rounded transition-all hover:border-crypto-400/50 ${
                            betMode === 'combo' && comboBets.some(bet => bet.matchId === match.id && bet.betType === 'home_win')
                              ? 'border-green-400 bg-green-500/20'
                              : selectedMatch?.id === match.id && selectedBetType === 'home_win' && betMode === 'single'
                              ? 'border-crypto-400 bg-crypto-500/20'
                              : ''
                          }`}
                        >
                          <p className="text-xs text-white/70">Home Win</p>
                          <p className="font-bold text-green-400">{match.odds.homeWin}x</p>
                        </motion.button>
                        {match.odds.draw && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (betMode === 'single') {
                                setSelectedMatch(match);
                                setSelectedBetType('draw');
                              } else {
                                addToCombo(match, 'draw');
                              }
                            }}
                            disabled={match.status === 'finished'}
                            className={`text-center p-2 glass rounded transition-all hover:border-crypto-400/50 ${
                              betMode === 'combo' && comboBets.some(bet => bet.matchId === match.id && bet.betType === 'draw')
                                ? 'border-green-400 bg-green-500/20'
                                : selectedMatch?.id === match.id && selectedBetType === 'draw' && betMode === 'single'
                                ? 'border-crypto-400 bg-crypto-500/20'
                                : ''
                            }`}
                          >
                            <p className="text-xs text-white/70">Draw</p>
                            <p className="font-bold text-yellow-400">{match.odds.draw}x</p>
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (betMode === 'single') {
                              setSelectedMatch(match);
                              setSelectedBetType('away_win');
                            } else {
                              addToCombo(match, 'away_win');
                            }
                          }}
                          disabled={match.status === 'finished'}
                          className={`text-center p-2 glass rounded transition-all hover:border-crypto-400/50 ${
                            betMode === 'combo' && comboBets.some(bet => bet.matchId === match.id && bet.betType === 'away_win')
                              ? 'border-green-400 bg-green-500/20'
                              : selectedMatch?.id === match.id && selectedBetType === 'away_win' && betMode === 'single'
                              ? 'border-crypto-400 bg-crypto-500/20'
                              : ''
                          }`}
                        >
                          <p className="text-xs text-white/70">Away Win</p>
                          <p className="font-bold text-red-400">{match.odds.awayWin}x</p>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>
          </div>

          {/* Betting Panel */}
          <div className="space-y-6">
            {/* Place Bet */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-crypto-400" />
                  {betMode === 'single' ? 'Place Single Bet' : 'Place Combo Bet'}
                </h3>
                
                {betMode === 'single' ? (
                  // Single Bet UI
                  selectedMatch ? (
                    <div className="space-y-4">
                      <div className="p-3 glass rounded-lg">
                        <p className="text-sm text-white/70 mb-1">Selected Match</p>
                        <p className="font-semibold text-white text-sm">
                          {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">Bet Type</label>
                        <select
                          value={selectedBetType}
                          onChange={(e) => setSelectedBetType(e.target.value as 'home_win' | 'away_win' | 'draw')}
                          className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                        >
                          <option value="home_win" className="bg-gray-800">
                            {selectedMatch.homeTeam} Win ({selectedMatch.odds.homeWin}x)
                          </option>
                          <option value="away_win" className="bg-gray-800">
                            {selectedMatch.awayTeam} Win ({selectedMatch.odds.awayWin}x)
                          </option>
                          {selectedMatch.odds.draw && (
                            <option value="draw" className="bg-gray-800">
                              Draw ({selectedMatch.odds.draw}x)
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">Currency</label>
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value as 'BTC' | 'ETH' | 'VEST')}
                          className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                        >
                          <option value="BTC" className="bg-gray-800">Bitcoin (BTC)</option>
                          <option value="ETH" className="bg-gray-800">Ethereum (ETH)</option>
                          <option value="VEST" className="bg-gray-800">VEST Token</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">Bet Amount</label>
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          step={selectedCurrency === 'VEST' ? 1 : 0.0001}
                          min={selectedCurrency === 'VEST' ? 1 : 0.0001}
                          className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                          placeholder={`Enter amount in ${selectedCurrency}`}
                        />
                      </div>

                      <div className="p-3 glass rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">Odds:</span>
                          <span className="text-crypto-400 font-semibold">
                            {selectedBetType === 'home_win' ? selectedMatch.odds.homeWin :
                             selectedBetType === 'away_win' ? selectedMatch.odds.awayWin :
                             selectedMatch.odds.draw}x
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Potential Payout:</span>
                          <span className="text-green-400 font-bold">
                            {(betAmount * (selectedBetType === 'home_win' ? selectedMatch.odds.homeWin :
                                          selectedBetType === 'away_win' ? selectedMatch.odds.awayWin :
                                          selectedMatch.odds.draw || 0)).toFixed(6)} {selectedCurrency}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlaceBet}
                        disabled={betAmount <= 0 || isPlacingBet || selectedMatch.status === 'finished'}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          betAmount > 0 && !isPlacingBet && selectedMatch.status !== 'finished'
                            ? 'bg-gradient-to-r from-crypto-500 to-green-600 text-white hover:from-crypto-600 hover:to-green-700'
                            : 'glass text-white/50 cursor-not-allowed'
                        }`}
                      >
                        {isPlacingBet ? 'Placing Bet...' : 
                         selectedMatch.status === 'finished' ? 'Match Finished' : 
                         'Place Single Bet'}
                      </motion.button>
                    </div>
                  ) : (
                    <p className="text-white/70 text-center py-8">
                      Select a match to place a single bet
                    </p>
                  )
                ) : (
                  // Combo Bet UI
                  <div className="space-y-4">
                    {comboBets.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Selected Matches ({comboBets.length}):</h4>
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                          {comboBets.map((bet, index) => (
                            <div key={bet.matchId} className="p-3 glass rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-white text-sm">{bet.matchName}</p>
                                  <p className="text-xs text-crypto-400">Odds: {bet.odds}x</p>
                                </div>
                                <button
                                  onClick={() => removeFromCombo(bet.matchId)}
                                  className="text-red-400 hover:text-red-300 text-sm ml-2"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center border-2 border-dashed border-white/20 rounded-lg">
                        <p className="text-white/70 mb-2">🎯 No matches selected</p>
                        <p className="text-sm text-white/50">Click on match odds above to add to combo</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-white/70 mb-2">Currency</label>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value as 'BTC' | 'ETH' | 'VEST')}
                        className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                      >
                        <option value="BTC" className="bg-gray-800">Bitcoin (BTC)</option>
                        <option value="ETH" className="bg-gray-800">Ethereum (ETH)</option>
                        <option value="VEST" className="bg-gray-800">VEST Token</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-2">Combo Bet Amount</label>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        step={selectedCurrency === 'VEST' ? 1 : 0.0001}
                        min={selectedCurrency === 'VEST' ? 1 : 0.0001}
                        className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                        placeholder={`Enter amount in ${selectedCurrency}`}
                      />
                    </div>

                    {comboBets.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/70">Matches:</p>
                            <p className="text-white font-semibold">{comboBets.length}</p>
                          </div>
                          <div>
                            <p className="text-white/70">Combined Odds:</p>
                            <p className="text-crypto-400 font-bold">{getCombinedOdds().toFixed(2)}x</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-white/70">Potential Payout:</p>
                            <p className="text-xl font-bold text-green-400">
                              {(betAmount * getCombinedOdds()).toFixed(6)} {selectedCurrency}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setComboBets([])}
                        disabled={comboBets.length === 0}
                        className="flex-1 glass-button py-2 text-white/70 hover:text-white disabled:opacity-50"
                      >
                        Clear All
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlaceBet}
                        disabled={comboBets.length < 2 || betAmount <= 0 || isPlacingBet}
                        className={`flex-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                          comboBets.length >= 2 && betAmount > 0 && !isPlacingBet
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                            : 'glass text-white/50 cursor-not-allowed'
                        }`}
                      >
                        {isPlacingBet ? 'Placing...' : 'Place Combo'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </GlassContainer>
            </motion.div>

            {/* My Bets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  My Active Bets
                </h3>
                
                {activeBets && activeBets.filter(bet => bet.gameType === 'sports').length > 0 ? (
                  <div className="space-y-3">
                    {activeBets
                      .filter(bet => bet.gameType === 'sports')
                      .slice(0, 3)
                      .map((bet) => (
                        <div key={bet.id} className="p-3 glass rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-white text-sm">Sports Bet</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              bet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              bet.status === 'won' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {bet.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 mb-1">
                            Amount: {bet.betAmount} {bet.currency}
                          </p>
                          <p className="text-sm text-white/70">
                            Potential: {bet.payout || (bet.betAmount * bet.odds).toFixed(6)} {bet.currency}
                          </p>
                        </div>
                      ))}
                    <Link to="/gaming/bets">
                      <button className="w-full glass-button py-2 text-crypto-400 hover:text-white">
                        View All Bets
                      </button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-white/70 text-center py-4">
                    No active bets yet
                  </p>
                )}
              </GlassContainer>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-crypto-400" />
                  Live Stats
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Live Matches</span>
                    <span className="text-green-400 font-semibold">
                      {mockMatches.filter(m => m.status === 'live').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Bets Today</span>
                    <span className="text-crypto-400 font-semibold">
                      {mockMatches.reduce((sum, m) => sum + m.totalBets, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Biggest Odds</span>
                    <span className="text-yellow-400 font-semibold">
                      {Math.max(...mockMatches.flatMap(m => [m.odds.homeWin, m.odds.awayWin, m.odds.draw || 0]))}x
                    </span>
                  </div>
                  {betMode === 'combo' && (
                    <>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between">
                          <span className="text-purple-300">Combo Matches</span>
                          <span className="text-purple-400 font-semibold">
                            {comboBets.length}/10
                          </span>
                        </div>
                        {comboBets.length > 0 && (
                          <div className="flex justify-between mt-1">
                            <span className="text-purple-300 text-sm">Combined Odds</span>
                            <span className="text-purple-400 font-bold text-sm">
                              {getCombinedOdds().toFixed(2)}x
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </GlassContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsBetting;