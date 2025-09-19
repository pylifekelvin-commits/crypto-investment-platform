import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  txHash?: string;
}

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'trade' | 'security' | 'profile';
  action: string;
  details?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

type FilterType = 'all' | 'buy' | 'sell' | 'deposit' | 'withdrawal';
type TimeFilter = 'all' | '24h' | '7d' | '30d' | '90d';
type TabType = 'transactions' | 'activity';

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation
  useEffect(() => {
    const generateMockTransactions = (): Transaction[] => {
      const types: Transaction['type'][] = ['buy', 'sell', 'deposit', 'withdrawal'];
      const symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL'];
      const statuses: Transaction['status'][] = ['completed', 'pending', 'failed'];
      
      return Array.from({ length: 25 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const amount = parseFloat((Math.random() * 10).toFixed(6));
        const price = Math.floor(Math.random() * 50000) + 1000;
        const status = i < 20 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: `tx_${i + 1}`,
          type,
          symbol,
          amount,
          price,
          total: amount * price,
          fee: (amount * price * 0.005),
          status,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        };
      }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const generateMockActivityLogs = (): ActivityLog[] => {
      const types: ActivityLog['type'][] = ['login', 'logout', 'trade', 'security', 'profile'];
      const actions = {
        login: ['Successful login', 'Failed login attempt', 'Login with 2FA'],
        logout: ['User logout', 'Session expired', 'Force logout'],
        trade: ['Buy order executed', 'Sell order executed', 'Order cancelled'],
        security: ['Password changed', '2FA enabled', 'API key generated'],
        profile: ['Profile updated', 'Email changed', 'Phone verified'],
      };
      
      return Array.from({ length: 50 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const typeActions = actions[type];
        const action = typeActions[Math.floor(Math.random() * typeActions.length)];
        
        return {
          id: `log_${i + 1}`,
          type,
          action,
          details: Math.random() > 0.7 ? 'Additional context information' : undefined,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        };
      }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setTimeout(() => {
      setTransactions(generateMockTransactions());
      setActivityLogs(generateMockActivityLogs());
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery && !tx.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    const now = new Date();
    const txDate = tx.timestamp;
    
    switch (timeFilter) {
      case '24h':
        return (now.getTime() - txDate.getTime()) < 24 * 60 * 60 * 1000;
      case '7d':
        return (now.getTime() - txDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return (now.getTime() - txDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
      case '90d':
        return (now.getTime() - txDate.getTime()) < 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  const filteredActivityLogs = activityLogs.filter(log => {
    if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    const now = new Date();
    const logDate = log.timestamp;
    
    switch (timeFilter) {
      case '24h':
        return (now.getTime() - logDate.getTime()) < 24 * 60 * 60 * 1000;
      case '7d':
        return (now.getTime() - logDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return (now.getTime() - logDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
      case '90d':
        return (now.getTime() - logDate.getTime()) < 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'buy':
      case 'deposit':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'sell':
      case 'withdrawal':
        return <ArrowDownLeft className="w-4 h-4 text-red-400" />;
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
      case 'logout':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'trade':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'security':
        return <CheckCircle className="w-4 h-4 text-yellow-400" />;
      case 'profile':
        return <CheckCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  const exportData = () => {
    const data = activeTab === 'transactions' ? filteredTransactions : filteredActivityLogs;
    const csvContent = activeTab === 'transactions' 
      ? `Date,Type,Symbol,Amount,Price,Total,Fee,Status\n${filteredTransactions.map(tx => 
          `${tx.timestamp.toISOString()},${tx.type},${tx.symbol},${tx.amount},${tx.price},${tx.total},${tx.fee},${tx.status}`
        ).join('\n')}`
      : `Date,Type,Action,Details,IP Address\n${filteredActivityLogs.map(log => 
          `${log.timestamp.toISOString()},${log.type},${log.action},${log.details || ''},${log.ipAddress || ''}`
        ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptovest-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white text-lg">Loading transaction history...</span>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-white/70 text-lg">
            Track all your trading activities and account actions in one place.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'transactions'
                ? 'bg-crypto-500 text-white'
                : 'glass-button text-white/70 hover:text-white'
            }`}
          >
            Transactions
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'activity'
                ? 'bg-crypto-500 text-white'
                : 'glass-button text-white/70 hover:text-white'
            }`}
          >
            Activity Logs
          </motion.button>
        </div>

        <GlassContainer animationDelay={0.2}>
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                />
              </div>
              
              {activeTab === 'transactions' && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="px-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                >
                  <option value="all" className="bg-gray-900">All Types</option>
                  <option value="buy" className="bg-gray-900">Buy</option>
                  <option value="sell" className="bg-gray-900">Sell</option>
                  <option value="deposit" className="bg-gray-900">Deposit</option>
                  <option value="withdrawal" className="bg-gray-900">Withdrawal</option>
                </select>
              )}
              
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="px-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
              >
                <option value="all" className="bg-gray-900">All Time</option>
                <option value="24h" className="bg-gray-900">Last 24h</option>
                <option value="7d" className="bg-gray-900">Last 7 days</option>
                <option value="30d" className="bg-gray-900">Last 30 days</option>
                <option value="90d" className="bg-gray-900">Last 90 days</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="glass-button px-4 py-3 text-white hover:text-crypto-400 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              {activeTab === 'transactions' ? (
                filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass p-4 rounded-xl hover:bg-white/25 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(tx.type)}
                            {getStatusIcon(tx.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold capitalize">{tx.type}</span>
                              <span className="text-crypto-400 font-bold">{tx.symbol}</span>
                            </div>
                            <p className="text-white/60 text-sm">
                              {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {tx.amount.toFixed(6)} {tx.symbol}
                          </p>
                          <p className="text-white/70 text-sm">
                            ${tx.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">No transactions found for the selected filters.</p>
                  </div>
                )
              ) : (
                filteredActivityLogs.length > 0 ? (
                  filteredActivityLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass p-4 rounded-xl hover:bg-white/25 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getActivityIcon(log.type)}
                          <div>
                            <p className="text-white font-semibold">{log.action}</p>
                            <p className="text-white/60 text-sm">
                              {log.timestamp.toLocaleDateString()} at {log.timestamp.toLocaleTimeString()}
                            </p>
                            {log.details && (
                              <p className="text-white/50 text-xs mt-1">{log.details}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-white/50 text-xs">
                          <p>{log.ipAddress}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.type === 'security' ? 'bg-yellow-500/20 text-yellow-400' :
                            log.type === 'trade' ? 'bg-green-500/20 text-green-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">No activity logs found for the selected filters.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};

export default TransactionHistory;