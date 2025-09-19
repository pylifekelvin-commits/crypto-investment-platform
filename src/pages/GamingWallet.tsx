import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import {
  Wallet,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Bitcoin,
  Zap,
  History,
  Send,
  Download,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'transfer';
  amount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  txHash?: string;
  gameType?: string;
}

const GamingWallet: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, updateGameBalance, setGameWallet } = useAppStore();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'VEST'>('BTC');
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'transactions'>('overview');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock transaction history
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: 'tx_1',
        type: 'deposit',
        amount: 0.005,
        currency: 'BTC',
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Wallet deposit',
        txHash: '0x1234...5678',
      },
      {
        id: 'tx_2',
        type: 'bet',
        amount: 0.001,
        currency: 'BTC',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        description: 'Sports bet - Lakers vs Warriors',
        gameType: 'sports',
      },
      {
        id: 'tx_3',
        type: 'win',
        amount: 0.0025,
        currency: 'BTC',
        status: 'completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Lottery win - Daily Draw',
        gameType: 'lottery',
      },
      {
        id: 'tx_4',
        type: 'withdrawal',
        amount: 0.002,
        currency: 'BTC',
        status: 'pending',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        description: 'Withdrawal to external wallet',
        txHash: '0x9876...5432',
      },
      {
        id: 'tx_5',
        type: 'bet',
        amount: 50,
        currency: 'VEST',
        status: 'completed',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        description: 'Casino - Lucky Dice',
        gameType: 'casino',
      },
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleDeposit = async () => {
    if (!user || !gameWallet || depositAmount <= 0) return;

    setIsProcessing(true);
    try {
      // Simulate deposit processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add to balance
      updateGameBalance(selectedCurrency, depositAmount);

      // Add transaction record
      const newTransaction: Transaction = {
        id: `dep_${Date.now()}`,
        type: 'deposit',
        amount: depositAmount,
        currency: selectedCurrency,
        status: 'completed',
        timestamp: new Date().toISOString(),
        description: `Deposit to gaming wallet`,
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      };

      setTransactions([newTransaction, ...transactions]);
      setDepositAmount(0);
      alert(`Successfully deposited ${depositAmount} ${selectedCurrency}!`);
    } catch (error) {
      alert('Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !gameWallet || withdrawAmount <= 0 || !withdrawAddress) return;

    if (gameWallet.balances[selectedCurrency] < withdrawAmount) {
      alert(`Insufficient ${selectedCurrency} balance`);
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Deduct from balance
      updateGameBalance(selectedCurrency, -withdrawAmount);

      // Add transaction record
      const newTransaction: Transaction = {
        id: `wit_${Date.now()}`,
        type: 'withdrawal',
        amount: withdrawAmount,
        currency: selectedCurrency,
        status: 'pending',
        timestamp: new Date().toISOString(),
        description: `Withdrawal to ${withdrawAddress.slice(0, 10)}...`,
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      };

      setTransactions([newTransaction, ...transactions]);
      setWithdrawAmount(0);
      setWithdrawAddress('');
      alert(`Withdrawal of ${withdrawAmount} ${selectedCurrency} initiated!`);
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getWalletAddress = (currency: 'BTC' | 'ETH' | 'VEST') => {
    const addresses = {
      BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ETH: '0x742d35Cc6584C3c2e6C1a4d2c1C5AfD8a8f0EE9B',
      VEST: '0x8ba1f109551bD432803012645Hac136c22C2',
    };
    return addresses[currency];
  };

  const getCurrencyIcon = (currency: 'BTC' | 'ETH' | 'VEST') => {
    switch (currency) {
      case 'BTC': return <Bitcoin className="w-5 h-5 text-orange-400" />;
      case 'ETH': return <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-white">Ξ</div>;
      case 'VEST': return <Zap className="w-5 h-5 text-crypto-400" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'bet': return <Minus className="w-4 h-4 text-orange-400" />;
      case 'win': return <Plus className="w-4 h-4 text-green-400" />;
      case 'transfer': return <Send className="w-4 h-4 text-blue-400" />;
      default: return <DollarSign className="w-4 h-4 text-white" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getTotalValue = () => {
    if (!gameWallet) return 0;
    // Mock conversion rates (in practice, these would come from an API)
    const rates = { BTC: 45000, ETH: 2500, VEST: 0.15 };
    return gameWallet.balances.BTC * rates.BTC + 
           gameWallet.balances.ETH * rates.ETH + 
           gameWallet.balances.VEST * rates.VEST;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gameWallet && Object.entries(gameWallet.balances).map(([currency, balance]) => (
          <motion.div
            key={currency}
            whileHover={{ scale: 1.02 }}
            className="p-6 glass rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getCurrencyIcon(currency as 'BTC' | 'ETH' | 'VEST')}
                <span className="font-semibold text-white">{currency}</span>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/50 hover:text-white"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">
                {showBalance ? 
                  `${balance.toFixed(currency === 'VEST' ? 0 : 6)} ${currency}` : 
                  '••••••'
                }
              </p>
              <p className="text-sm text-white/50">
                Gaming Wallet Balance
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Portfolio Value */}
      <GlassContainer className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Portfolio Value</h3>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-crypto-400">
              {showBalance ? `$${getTotalValue().toLocaleString()}` : '$••••••'}
            </p>
            <p className="text-sm text-green-400">+5.2% (24h)</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70">Total Wagered</p>
              <p className="font-semibold text-white">
                {gameWallet ? `${gameWallet.totalWagered.toFixed(6)} BTC` : '0 BTC'}
              </p>
            </div>
            <div>
              <p className="text-white/70">Total Won</p>
              <p className="font-semibold text-green-400">
                {gameWallet ? `${gameWallet.totalWon.toFixed(6)} BTC` : '0 BTC'}
              </p>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('deposit')}
          className="p-4 glass rounded-xl text-center border border-green-500/20 hover:border-green-500/50"
        >
          <ArrowDownLeft className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">Deposit</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('withdraw')}
          className="p-4 glass rounded-xl text-center border border-red-500/20 hover:border-red-500/50"
        >
          <ArrowUpRight className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">Withdraw</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('transactions')}
          className="p-4 glass rounded-xl text-center border border-blue-500/20 hover:border-blue-500/50"
        >
          <History className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">History</p>
        </motion.button>
        <Link to="/gaming">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-4 glass rounded-xl text-center border border-crypto-500/20 hover:border-crypto-500/50"
          >
            <Zap className="w-6 h-6 text-crypto-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">Play Games</p>
          </motion.button>
        </Link>
      </div>
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-6">
      <GlassContainer className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Deposit Crypto</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Select Currency</label>
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
            <label className="block text-sm text-white/70 mb-2">Deposit Address</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getWalletAddress(selectedCurrency)}
                readOnly
                className="flex-1 glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
              />
              <button
                onClick={() => copyToClipboard(getWalletAddress(selectedCurrency))}
                className="glass-button p-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Amount (Demo)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              step={selectedCurrency === 'VEST' ? 1 : 0.0001}
              min={0}
              className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
              placeholder={`Enter amount in ${selectedCurrency}`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeposit}
            disabled={depositAmount <= 0 || isProcessing}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              depositAmount > 0 && !isProcessing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'glass text-white/50 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Simulate Deposit'}
          </motion.button>
        </div>
      </GlassContainer>

      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
        <p className="text-sm text-blue-300 mb-2">ℹ️ Demo Mode</p>
        <p className="text-xs text-blue-200/70">
          This is a demo deposit system. In production, you would send actual crypto to the displayed address.
          For demo purposes, clicking "Simulate Deposit" will add the amount to your gaming wallet.
        </p>
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      <GlassContainer className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Withdraw Crypto</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Select Currency</label>
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
            <label className="block text-sm text-white/70 mb-2">Available Balance</label>
            <p className="text-lg font-bold text-crypto-400">
              {gameWallet ? 
                `${gameWallet.balances[selectedCurrency].toFixed(selectedCurrency === 'VEST' ? 0 : 6)} ${selectedCurrency}` : 
                '0'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Withdrawal Address</label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
              placeholder={`Enter ${selectedCurrency} address`}
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">Amount</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              step={selectedCurrency === 'VEST' ? 1 : 0.0001}
              min={0}
              max={gameWallet?.balances[selectedCurrency] || 0}
              className="w-full glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
              placeholder={`Enter amount in ${selectedCurrency}`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWithdraw}
            disabled={withdrawAmount <= 0 || !withdrawAddress || isProcessing}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              withdrawAmount > 0 && withdrawAddress && !isProcessing
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                : 'glass text-white/50 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Withdraw'}
          </motion.button>
        </div>
      </GlassContainer>

      <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
        <p className="text-sm text-yellow-300 mb-2">⚠️ Security Notice</p>
        <p className="text-xs text-yellow-200/70">
          Always verify withdrawal addresses carefully. Crypto transactions are irreversible.
          Withdrawals are processed within 24 hours and may incur network fees.
        </p>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Transaction History</h3>
        <button className="glass-button p-2">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <GlassContainer key={tx.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTransactionIcon(tx.type)}
                <div>
                  <p className="font-semibold text-white">{tx.description}</p>
                  <p className="text-sm text-white/50">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <p className={`font-bold ${
                    tx.type === 'win' || tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'win' || tx.type === 'deposit' ? '+' : '-'}
                    {tx.amount.toFixed(tx.currency === 'VEST' ? 0 : 6)} {tx.currency}
                  </p>
                  {getStatusIcon(tx.status)}
                </div>
                {tx.txHash && (
                  <button
                    onClick={() => copyToClipboard(tx.txHash!)}
                    className="text-xs text-crypto-400 hover:text-crypto-300"
                  >
                    {tx.txHash}
                  </button>
                )}
              </div>
            </div>
          </GlassContainer>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
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
                💳 <span className="bg-gradient-to-r from-crypto-400 to-blue-500 bg-clip-text text-transparent">
                  Gaming Wallet
                </span>
              </h1>
              <p className="text-white/70">Manage your crypto gaming funds</p>
            </div>
          </div>
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
              { id: 'overview', label: 'Overview', icon: Wallet },
              { id: 'deposit', label: 'Deposit', icon: ArrowDownLeft },
              { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
              { id: 'transactions', label: 'History', icon: History },
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
          {activeTab === 'deposit' && renderDeposit()}
          {activeTab === 'withdraw' && renderWithdraw()}
          {activeTab === 'transactions' && renderTransactions()}
        </motion.div>
      </div>
    </div>
  );
};

export default GamingWallet;