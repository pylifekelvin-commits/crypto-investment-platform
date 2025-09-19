import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Gift,
  Clock,
  Users,
  Trophy,
  Coins,
  Star,
  Zap,
  ArrowLeft,
  Calendar,
  Target,
  Award,
  Sparkles,
} from 'lucide-react';

const Lottery: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, userTickets, lotteryDraws, purchaseLotteryTicket, updateGameBalance } = useAppStore();
  const [selectedLottery, setSelectedLottery] = useState<'daily' | 'weekly' | 'instant'>('daily');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock lottery data
  const lotteryTypes = {
    daily: {
      name: 'Daily Draw',
      price: 0.0001, // BTC
      currency: 'BTC',
      prize: '0.005 BTC',
      nextDraw: '2 hours 34 minutes',
      participants: 156,
      maxNumbers: 6,
      numberRange: 49,
      description: 'Pick 6 numbers from 1-49. Draws every 24 hours.',
    },
    weekly: {
      name: 'Weekly Mega',
      price: 0.001,
      currency: 'BTC',
      prize: '0.1 BTC',
      nextDraw: '3 days 12 hours',
      participants: 489,
      maxNumbers: 7,
      numberRange: 59,
      description: 'Pick 7 numbers from 1-59. Big prizes every week.',
    },
    instant: {
      name: 'Instant Win',
      price: 50,
      currency: 'VEST',
      prize: '1000 VEST',
      nextDraw: 'Instant',
      participants: 23,
      maxNumbers: 3,
      numberRange: 20,
      description: 'Pick 3 numbers from 1-20. Instant results!',
    },
  };

  const currentLottery = lotteryTypes[selectedLottery];

  useEffect(() => {
    // Reset selected numbers when changing lottery type
    setSelectedNumbers([]);
  }, [selectedLottery]);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < currentLottery.maxNumbers) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const generateRandomNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < currentLottery.maxNumbers) {
      const num = Math.floor(Math.random() * currentLottery.numberRange) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const handlePurchaseTicket = async () => {
    if (!user || !gameWallet) return;
    
    if (selectedNumbers.length !== currentLottery.maxNumbers) {
      alert(`Please select ${currentLottery.maxNumbers} numbers`);
      return;
    }

    const totalCost = currentLottery.price * ticketQuantity;
    const currency = currentLottery.currency as 'BTC' | 'ETH' | 'VEST';
    
    if (gameWallet.balances[currency] < totalCost) {
      alert(`Insufficient ${currency} balance`);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for instant win
      const isInstantWin = selectedLottery === 'instant' && Math.random() < 0.1;
      
      // Purchase lottery ticket
      const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      purchaseLotteryTicket({
        id: ticketId,
        userId: user.id,
        drawId: 'current_draw',
        numbers: selectedNumbers,
        quantity: ticketQuantity,
        totalCost,
        currency,
        purchaseDate: new Date().toISOString(),
        drawDate: selectedLottery === 'instant' ? new Date().toISOString() : 
                  selectedLottery === 'daily' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() :
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: selectedLottery === 'instant' ? 'completed' : 'pending',
        isWinner: isInstantWin,
        prizeAmount: isInstantWin ? currentLottery.price * 10 : undefined,
      });

      // Update balance
      updateGameBalance(currency, -totalCost);

      // Handle instant win
      if (isInstantWin) {
        const winAmount = currentLottery.price * 10;
        updateGameBalance(currency, winAmount);
        alert(`Congratulations! You won ${winAmount} ${currency}!`);
      }

      // Reset form
      setSelectedNumbers([]);
      setTicketQuantity(1);
      
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Failed to purchase ticket. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const recentWinners = [
    { name: 'Player1', amount: '0.05 BTC', game: 'Weekly Mega' },
    { name: 'Player2', amount: '500 VEST', game: 'Instant Win' },
    { name: 'Player3', amount: '0.002 BTC', game: 'Daily Draw' },
  ];

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
                🎫 <span className="bg-gradient-to-r from-crypto-400 to-yellow-500 bg-clip-text text-transparent">
                  Crypto Lottery
                </span>
              </h1>
              <p className="text-white/70">Win big with our provably fair lottery games</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Lottery Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lottery Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassContainer className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-crypto-400" />
                  Select Lottery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(lotteryTypes).map(([key, lottery]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLottery(key as 'daily' | 'weekly' | 'instant')}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedLottery === key
                          ? 'border-crypto-400 bg-crypto-500/20'
                          : 'border-white/20 hover:border-crypto-400/50'
                      }`}
                    >
                      <h3 className="font-bold text-white mb-1">{lottery.name}</h3>
                      <p className="text-sm text-white/70 mb-2">{lottery.description}</p>
                      <p className="text-crypto-400 font-semibold">
                        {lottery.price} {lottery.currency}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>

            {/* Current Lottery Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassContainer className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{currentLottery.name}</h2>
                  <div className="text-right">
                    <p className="text-sm text-white/70">Prize Pool</p>
                    <p className="text-2xl font-bold text-yellow-400">{currentLottery.prize}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-crypto-400 mx-auto mb-1" />
                    <p className="text-sm text-white/70">Next Draw</p>
                    <p className="font-semibold text-white">{currentLottery.nextDraw}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-crypto-400 mx-auto mb-1" />
                    <p className="text-sm text-white/70">Players</p>
                    <p className="font-semibold text-white">{currentLottery.participants}</p>
                  </div>
                  <div className="text-center">
                    <Coins className="w-5 h-5 text-crypto-400 mx-auto mb-1" />
                    <p className="text-sm text-white/70">Ticket Price</p>
                    <p className="font-semibold text-white">
                      {currentLottery.price} {currentLottery.currency}
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-5 h-5 text-crypto-400 mx-auto mb-1" />
                    <p className="text-sm text-white/70">Pick Numbers</p>
                    <p className="font-semibold text-white">
                      {currentLottery.maxNumbers} of {currentLottery.numberRange}
                    </p>
                  </div>
                </div>

                {/* Number Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      Select {currentLottery.maxNumbers} Numbers
                    </h3>
                    <button
                      onClick={generateRandomNumbers}
                      className="glass-button px-4 py-2 text-crypto-400 hover:text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Quick Pick
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
                    {Array.from({ length: currentLottery.numberRange }, (_, i) => i + 1).map((number) => (
                      <motion.button
                        key={number}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNumberSelect(number)}
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
                    <div className="mt-4 p-4 glass rounded-xl">
                      <p className="text-sm text-white/70 mb-2">Selected Numbers:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedNumbers.map((number) => (
                          <span
                            key={number}
                            className="px-3 py-1 bg-crypto-500 text-white rounded-full text-sm font-bold"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity and Purchase */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Tickets</label>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
                    >
                      {[1, 2, 3, 5, 10].map((qty) => (
                        <option key={qty} value={qty} className="bg-gray-800">
                          {qty} ticket{qty > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/70">Total Cost</p>
                    <p className="text-xl font-bold text-white">
                      {(currentLottery.price * ticketQuantity).toFixed(currentLottery.currency === 'BTC' ? 6 : 0)} {currentLottery.currency}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePurchaseTicket}
                      disabled={selectedNumbers.length !== currentLottery.maxNumbers || isProcessing}
                      className={`mt-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedNumbers.length === currentLottery.maxNumbers && !isProcessing
                          ? 'bg-gradient-to-r from-crypto-500 to-yellow-600 text-white hover:from-crypto-600 hover:to-yellow-700'
                          : 'glass text-white/50 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? 'Processing...' : 'Buy Ticket'}
                    </motion.button>
                  </div>
                </div>
              </GlassContainer>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Winners */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Recent Winners
                </h3>
                <div className="space-y-3">
                  {recentWinners.map((winner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <p className="font-semibold text-white">{winner.name}</p>
                        <p className="text-sm text-white/70">{winner.game}</p>
                      </div>
                      <p className="text-sm font-bold text-crypto-400">{winner.amount}</p>
                    </div>
                  ))}
                </div>
              </GlassContainer>
            </motion.div>

            {/* My Tickets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-crypto-400" />
                  My Tickets
                </h3>
                {userTickets && userTickets.length > 0 ? (
                  <div className="space-y-2">
                    {userTickets.slice(0, 3).map((ticket: any) => (
                      <div key={ticket.id} className="p-3 glass rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-white">{selectedLottery}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            ticket.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/70">
                          Numbers: {ticket.numbers.join(', ')}
                        </p>
                        {ticket.prizeAmount && ticket.prizeAmount > 0 && (
                          <p className="text-sm font-bold text-green-400 mt-1">
                            Won: {ticket.prizeAmount} {currentLottery.currency}
                          </p>
                        )}
                      </div>
                    ))}
                    <Link to="/gaming/tickets">
                      <button className="w-full glass-button py-2 text-crypto-400 hover:text-white">
                        View All Tickets
                      </button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-white/70 text-center py-4">
                    No tickets purchased yet
                  </p>
                )}
              </GlassContainer>
            </motion.div>

            {/* How to Play */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassContainer className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-crypto-400" />
                  How to Play
                </h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex gap-2">
                    <span className="text-crypto-400 font-bold">1.</span>
                    <span>Choose your lottery type</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-crypto-400 font-bold">2.</span>
                    <span>Select your lucky numbers</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-crypto-400 font-bold">3.</span>
                    <span>Purchase tickets with crypto</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-crypto-400 font-bold">4.</span>
                    <span>Wait for the draw results</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-crypto-400 font-bold">5.</span>
                    <span>Win crypto prizes automatically!</span>
                  </div>
                </div>
              </GlassContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lottery;