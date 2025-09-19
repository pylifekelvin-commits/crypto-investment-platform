import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Coins,
  Star,
  ArrowLeft,
  Trophy,
  Zap,
  RotateCcw,
  Play,
  Sparkles,
  Crown,
  Target,
} from 'lucide-react';

const CasinoGames: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, activeSessions, startGameSession, endGameSession, updateGameBalance } = useAppStore();
  const [selectedGame, setSelectedGame] = useState<'dice' | 'spin_bottle' | 'roulette' | 'slots'>('dice');
  const [betAmount, setBetAmount] = useState<number>(0.001);
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'VEST'>('BTC');
  const [isPlaying, setIsPlaying] = useState(false);

  // Dice Game State
  const [diceResult, setDiceResult] = useState<number[]>([]);
  const [diceTarget, setDiceTarget] = useState<number>(4);
  const [diceAnimation, setDiceAnimation] = useState(false);

  // Spin the Bottle State
  const [bottleRotation, setBottleRotation] = useState(0);
  const [spinAnimation, setSpinAnimation] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  // Roulette State
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [rouletteAnimation, setRouletteAnimation] = useState(false);

  // Slots State
  const [slotResults, setSlotResults] = useState<string[]>(['🍎', '🍊', '🍋']);
  const [slotsAnimation, setSlotsAnimation] = useState(false);

  const games = [
    {
      id: 'dice',
      name: 'Lucky Dice',
      icon: '🎲',
      description: 'Roll dice and predict the outcome',
      minBet: 0.0001,
      maxMultiplier: '6x',
    },
    {
      id: 'spin_bottle',
      name: 'Spin the Bottle',
      icon: '🍾',
      description: 'Spin and win based on result',
      minBet: 0.0005,
      maxMultiplier: '8x',
    },
    {
      id: 'roulette',
      name: 'Crypto Roulette',
      icon: '🎰',
      description: 'Classic roulette with crypto',
      minBet: 0.001,
      maxMultiplier: '36x',
    },
    {
      id: 'slots',
      name: 'Fruit Slots',
      icon: '🎰',
      description: 'Match 3 symbols to win',
      minBet: 0.0005,
      maxMultiplier: '10x',
    },
  ];

  const players = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const slotSymbols = ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍒', '💎'];
  const rouletteNumbers = Array.from({ length: 37 }, (_, i) => i); // 0-36

  const getDiceIcon = (number: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    return icons[number - 1] || Dice1;
  };

  const calculateDiceMultiplier = (target: number) => {
    return (6 / (7 - target)).toFixed(2);
  };

  const playDiceGame = async () => {
    if (!user || !gameWallet || gameWallet.balances[selectedCurrency] < betAmount) {
      alert(`Insufficient ${selectedCurrency} balance`);
      return;
    }

    setIsPlaying(true);
    setDiceAnimation(true);

    // Deduct bet amount
    updateGameBalance(selectedCurrency, -betAmount);

    // Simulate dice rolling animation
    const animationDuration = 2000;
    const intervals = 10;
    const intervalDuration = animationDuration / intervals;

    for (let i = 0; i < intervals; i++) {
      setTimeout(() => {
        setDiceResult([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]);
      }, i * intervalDuration);
    }

    setTimeout(() => {
      const finalResult = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceResult(finalResult);
      setDiceAnimation(false);

      const sum = finalResult.reduce((a, b) => a + b, 0);
      const isWin = sum >= diceTarget;
      
      if (isWin) {
        const multiplier = parseFloat(calculateDiceMultiplier(diceTarget));
        const winAmount = betAmount * multiplier;
        updateGameBalance(selectedCurrency, winAmount);
        alert(`You won! ${winAmount.toFixed(6)} ${selectedCurrency}`);
      } else {
        alert('You lost! Better luck next time.');
      }

      setIsPlaying(false);
    }, animationDuration);
  };

  const playSpinBottle = async () => {
    if (!user || !gameWallet || gameWallet.balances[selectedCurrency] < betAmount) {
      alert(`Insufficient ${selectedCurrency} balance`);
      return;
    }

    setIsPlaying(true);
    setSpinAnimation(true);

    // Deduct bet amount
    updateGameBalance(selectedCurrency, -betAmount);

    // Spin animation
    const spins = Math.floor(Math.random() * 5) + 3; // 3-7 full spins
    const finalRotation = bottleRotation + (spins * 360) + Math.random() * 360;
    setBottleRotation(finalRotation);

    setTimeout(() => {
      const selectedIndex = Math.floor((finalRotation % 360) / (360 / players.length));
      const winner = players[selectedIndex];
      setSelectedPlayer(winner);
      setSpinAnimation(false);

      // Check if user selected the right player (simplified - auto win for demo)
      const isWin = Math.random() < 0.25; // 25% win rate
      
      if (isWin) {
        const winAmount = betAmount * 4;
        updateGameBalance(selectedCurrency, winAmount);
        alert(`You won! Player ${winner} was selected. +${winAmount.toFixed(6)} ${selectedCurrency}`);
      } else {
        alert(`Player ${winner} was selected. You lost this round.`);
      }

      setIsPlaying(false);
    }, 3000);
  };

  const playRoulette = async () => {
    if (!user || !gameWallet || gameWallet.balances[selectedCurrency] < betAmount) {
      alert(`Insufficient ${selectedCurrency} balance`);
      return;
    }

    if (selectedNumbers.length === 0) {
      alert('Please select at least one number');
      return;
    }

    setIsPlaying(true);
    setRouletteAnimation(true);

    // Deduct bet amount
    updateGameBalance(selectedCurrency, -betAmount);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 37); // 0-36
      setRouletteResult(result);
      setRouletteAnimation(false);

      const isWin = selectedNumbers.includes(result);
      
      if (isWin) {
        const multiplier = 36 / selectedNumbers.length; // More numbers = lower multiplier
        const winAmount = betAmount * multiplier;
        updateGameBalance(selectedCurrency, winAmount);
        alert(`You won! Number ${result} hit. +${winAmount.toFixed(6)} ${selectedCurrency}`);
      } else {
        alert(`Number ${result} hit. You lost this round.`);
      }

      setIsPlaying(false);
    }, 2500);
  };

  const playSlots = async () => {
    if (!user || !gameWallet || gameWallet.balances[selectedCurrency] < betAmount) {
      alert(`Insufficient ${selectedCurrency} balance`);
      return;
    }

    setIsPlaying(true);
    setSlotsAnimation(true);

    // Deduct bet amount
    updateGameBalance(selectedCurrency, -betAmount);

    // Slot spinning animation
    const animationDuration = 3000;
    const intervals = 20;
    const intervalDuration = animationDuration / intervals;

    for (let i = 0; i < intervals; i++) {
      setTimeout(() => {
        setSlotResults([
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        ]);
      }, i * intervalDuration);
    }

    setTimeout(() => {
      const finalResults = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ];
      setSlotResults(finalResults);
      setSlotsAnimation(false);

      // Check for wins
      const allSame = finalResults.every(symbol => symbol === finalResults[0]);
      const twoSame = finalResults.filter(symbol => symbol === finalResults[0]).length === 2;
      
      let multiplier = 0;
      if (allSame) {
        multiplier = finalResults[0] === '💎' ? 10 : 5; // Diamond jackpot
      } else if (twoSame) {
        multiplier = 2;
      }

      if (multiplier > 0) {
        const winAmount = betAmount * multiplier;
        updateGameBalance(selectedCurrency, winAmount);
        alert(`You won! ${multiplier}x multiplier! +${winAmount.toFixed(6)} ${selectedCurrency}`);
      } else {
        alert('No match! Better luck next time.');
      }

      setIsPlaying(false);
    }, animationDuration);
  };

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 5) { // Max 5 numbers
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const renderGameArea = () => {
    switch (selectedGame) {
      case 'dice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Lucky Dice 🎲</h3>
              <p className="text-white/70 mb-6">Roll two dice and predict if the sum will be {diceTarget} or higher</p>
              
              <div className="flex justify-center gap-4 mb-6">
                {diceResult.map((dice, index) => {
                  const DiceIcon = getDiceIcon(dice);
                  return (
                    <motion.div
                      key={index}
                      animate={diceAnimation ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5, repeat: diceAnimation ? Infinity : 0 }}
                      className="p-4 glass rounded-xl"
                    >
                      <DiceIcon className="w-12 h-12 text-crypto-400" />
                    </motion.div>
                  );
                })}
              </div>

              <div className="mb-6">
                <label className="block text-sm text-white/70 mb-2">Target Sum (Higher wins)</label>
                <select
                  value={diceTarget}
                  onChange={(e) => setDiceTarget(Number(e.target.value))}
                  disabled={isPlaying}
                  className="glass rounded-lg px-4 py-2 text-white bg-transparent border border-white/20"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num} className="bg-gray-800">
                      {num}+ (Multiplier: {calculateDiceMultiplier(num)}x)
                    </option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playDiceGame}
                disabled={isPlaying}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isPlaying
                    ? 'glass text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-crypto-500 to-purple-600 text-white hover:from-crypto-600 hover:to-purple-700'
                }`}
              >
                {isPlaying ? 'Rolling...' : 'Roll Dice'}
              </motion.button>
            </div>
          </div>
        );

      case 'spin_bottle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Spin the Bottle 🍾</h3>
              <p className="text-white/70 mb-6">Spin the bottle and win based on the selected player</p>
              
              <div className="relative w-64 h-64 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-crypto-400/20 glass">
                  {players.map((player, index) => {
                    const angle = (index * 360) / players.length;
                    return (
                      <div
                        key={player}
                        className="absolute text-sm font-semibold text-white"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-120px)`,
                          transformOrigin: '50% 120px',
                        }}
                      >
                        {player}
                      </div>
                    );
                  })}
                </div>
                
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: bottleRotation }}
                  transition={{ duration: spinAnimation ? 3 : 0.5, ease: 'easeOut' }}
                >
                  <div className="text-6xl">🍾</div>
                </motion.div>
              </div>

              {selectedPlayer && (
                <p className="text-lg text-crypto-400 mb-4">
                  Selected: <span className="font-bold">{selectedPlayer}</span>
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playSpinBottle}
                disabled={isPlaying}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isPlaying
                    ? 'glass text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-crypto-500 to-green-600 text-white hover:from-crypto-600 hover:to-green-700'
                }`}
              >
                {isPlaying ? 'Spinning...' : 'Spin Bottle'}
              </motion.button>
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Crypto Roulette 🎰</h3>
              <p className="text-white/70 mb-6">Select up to 5 numbers and spin the wheel</p>
              
              {rouletteResult !== null && (
                <div className="mb-6">
                  <div className="text-6xl mb-2">🎰</div>
                  <p className="text-2xl font-bold text-crypto-400">
                    Winning Number: {rouletteResult}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-6 gap-2 mb-6 max-w-md mx-auto">
                {rouletteNumbers.slice(0, 36).map(number => (
                  <motion.button
                    key={number}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNumberSelect(number)}
                    disabled={isPlaying}
                    className={`aspect-square rounded-lg text-sm font-bold transition-all ${
                      selectedNumbers.includes(number)
                        ? 'bg-crypto-500 text-white border-crypto-400'
                        : 'glass border-white/20 text-white hover:border-crypto-400'
                    }`}
                  >
                    {number}
                  </motion.button>
                ))}
              </div>

              {selectedNumbers.length > 0 && (
                <div className="mb-4 p-3 glass rounded-lg">
                  <p className="text-sm text-white/70 mb-2">Selected Numbers:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedNumbers.map(number => (
                      <span key={number} className="px-2 py-1 bg-crypto-500 text-white rounded text-sm">
                        {number}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Multiplier: {(36 / selectedNumbers.length).toFixed(1)}x
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSelectedNumbers([])}
                  disabled={isPlaying}
                  className="glass-button px-4 py-2 text-white/70 hover:text-white"
                >
                  Clear
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playRoulette}
                  disabled={isPlaying || selectedNumbers.length === 0}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    isPlaying || selectedNumbers.length === 0
                      ? 'glass text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-crypto-500 to-red-600 text-white hover:from-crypto-600 hover:to-red-700'
                  }`}
                >
                  {isPlaying ? 'Spinning...' : 'Spin Roulette'}
                </motion.button>
              </div>
            </div>
          </div>
        );

      case 'slots':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Fruit Slots 🎰</h3>
              <p className="text-white/70 mb-6">Match 3 symbols to win! 💎 = 10x, Others = 5x, 2 Match = 2x</p>
              
              <div className="flex justify-center gap-4 mb-6">
                {slotResults.map((symbol, index) => (
                  <motion.div
                    key={index}
                    animate={slotsAnimation ? { y: [-20, 0, -20] } : {}}
                    transition={{ duration: 0.5, repeat: slotsAnimation ? Infinity : 0 }}
                    className="w-20 h-20 glass rounded-xl flex items-center justify-center text-4xl"
                  >
                    {symbol}
                  </motion.div>
                ))}
              </div>

              <div className="mb-6 text-sm text-white/70">
                <p>Symbols: 🍎 🍊 🍋 🍇 🍓 🥝 🍒 💎</p>
                <p>Match 3 💎 = 10x | Match 3 Others = 5x | Match 2 = 2x</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playSlots}
                disabled={isPlaying}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isPlaying
                    ? 'glass text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-crypto-500 to-yellow-600 text-white hover:from-crypto-600 hover:to-yellow-700'
                }`}
              >
                {isPlaying ? 'Spinning...' : 'Spin Slots'}
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                🎰 <span className="bg-gradient-to-r from-crypto-400 to-purple-500 bg-clip-text text-transparent">
                  Casino Games
                </span>
              </h1>
              <p className="text-white/70">Play classic casino games with cryptocurrency</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Selection */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassContainer className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-crypto-400" />
                  Select Game
                </h2>
                <div className="space-y-3">
                  {games.map((game) => (
                    <motion.button
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGame(game.id as any)}
                      disabled={isPlaying}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        selectedGame === game.id
                          ? 'border-crypto-400 bg-crypto-500/20'
                          : 'border-white/20 hover:border-crypto-400/50'
                      } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{game.icon}</span>
                        <h3 className="font-bold text-white">{game.name}</h3>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{game.description}</p>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Min: {game.minBet} BTC</span>
                        <span>Max: {game.maxMultiplier}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>

            {/* Betting Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-crypto-400" />
                  Bet Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Currency</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value as 'BTC' | 'ETH' | 'VEST')}
                      disabled={isPlaying}
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
                      disabled={isPlaying}
                      className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                      placeholder={`Enter amount in ${selectedCurrency}`}
                    />
                  </div>

                  {gameWallet && (
                    <div className="p-3 glass rounded-lg">
                      <p className="text-sm text-white/70">Available Balance</p>
                      <p className="font-bold text-crypto-400">
                        {gameWallet.balances[selectedCurrency].toFixed(selectedCurrency === 'VEST' ? 0 : 6)} {selectedCurrency}
                      </p>
                    </div>
                  )}
                </div>
              </GlassContainer>
            </motion.div>
          </div>

          {/* Game Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassContainer className="p-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGame}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderGameArea()}
                  </motion.div>
                </AnimatePresence>
              </GlassContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoGames;