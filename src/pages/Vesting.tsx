import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useNotifications } from '../components/NotificationSystem';
import {
  Clock,
  TrendingUp,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Target,
  Award,
  ArrowRight,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { VestingPlan, VestingPosition } from '../types';

const Vesting: React.FC = () => {
  const { 
    vestingPlans, 
    vestingPositions, 
    setVestingPlans, 
    addVestingPosition,
    user 
  } = useAppStore();
  const { showNotification } = useNotifications();
  const [selectedPlan, setSelectedPlan] = useState<VestingPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initialize vesting plans
  useEffect(() => {
    const plans: VestingPlan[] = [
      {
        id: 'starter',
        name: 'Crypto Starter',
        description: 'Perfect for beginners looking to grow their crypto portfolio steadily',
        minInvestment: 100,
        maxInvestment: 5000,
        duration: 90, // 3 months
        apy: 8.5,
        compoundingFrequency: 'monthly',
        earlyWithdrawalPenalty: 2,
        supportedAssets: ['BTC', 'ETH'],
        riskLevel: 'low',
        icon: '🌱',
        color: 'from-green-400 to-green-600'
      },
      {
        id: 'growth',
        name: 'Growth Accelerator',
        description: 'For experienced investors seeking higher returns with balanced risk',
        minInvestment: 1000,
        maxInvestment: 25000,
        duration: 180, // 6 months
        apy: 12.8,
        compoundingFrequency: 'weekly',
        earlyWithdrawalPenalty: 3,
        supportedAssets: ['BTC', 'ETH', 'BNB', 'ADA'],
        riskLevel: 'medium',
        icon: '🚀',
        color: 'from-blue-400 to-blue-600'
      },
      {
        id: 'premium',
        name: 'Premium Vault',
        description: 'Maximum returns for long-term crypto veterans',
        minInvestment: 5000,
        maxInvestment: 100000,
        duration: 365, // 1 year
        apy: 18.5,
        compoundingFrequency: 'daily',
        earlyWithdrawalPenalty: 5,
        supportedAssets: ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT'],
        riskLevel: 'high',
        icon: '💎',
        color: 'from-purple-400 to-purple-600'
      }
    ];
    setVestingPlans(plans);
  }, [setVestingPlans]);

  const handleCreateVestingPosition = () => {
    if (!selectedPlan || !investmentAmount || !user) {
      showNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please select a plan and enter investment amount'
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < selectedPlan.minInvestment || amount > selectedPlan.maxInvestment) {
      showNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: `Amount must be between $${selectedPlan.minInvestment} and $${selectedPlan.maxInvestment}`
      });
      return;
    }

    const position: VestingPosition = {
      id: `vesting_${Date.now()}`,
      userId: user.id,
      planId: selectedPlan.id,
      asset: selectedAsset,
      amount,
      initialValue: amount,
      currentValue: amount,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + selectedPlan.duration * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      earnedRewards: 0,
      lastRewardDate: new Date().toISOString(),
      autoReinvest: true
    };

    addVestingPosition(position);
    setShowCreateModal(false);
    setInvestmentAmount('');
    
    showNotification({
      type: 'success',
      title: 'Vesting Position Created!',
      message: `Successfully created ${selectedPlan.name} position with ${amount} ${selectedAsset}`
    });
  };

  const calculateProjectedReturn = (plan: VestingPlan, amount: number) => {
    const years = plan.duration / 365;
    const compoundedAmount = amount * Math.pow(1 + plan.apy / 100, years);
    return compoundedAmount - amount;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
  };

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
              <Lock className="w-8 h-8 text-crypto-400" />
              Crypto Vesting
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="glass-button px-6 py-3 text-white hover:text-crypto-400 flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start Vesting
            </motion.button>
          </div>
          <p className="text-white/70 text-lg">
            Lock your crypto for guaranteed returns. Higher rates, lower risk, automated growth.
          </p>
        </motion.div>

        {/* Vesting Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {vestingPlans.map((plan, index) => (
            <GlassContainer key={plan.id} animationDelay={0.1 + index * 0.1} hover>
              <div className="p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="glass p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">APY</span>
                      <span className="text-green-400 font-bold text-xl">{plan.apy}%</span>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Duration</span>
                      <span className="text-white font-semibold">{formatDuration(plan.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Compounding</span>
                      <span className="text-white font-semibold capitalize">{plan.compoundingFrequency}</span>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Min Investment</span>
                      <span className="text-white font-semibold">${plan.minInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Max Investment</span>
                      <span className="text-white font-semibold">${plan.maxInvestment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getRiskBadgeColor(plan.riskLevel)}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {plan.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="text-white/70 text-sm">
                      {plan.supportedAssets.length} assets
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowCreateModal(true);
                  }}
                  className={`w-full mt-6 py-4 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg`}
                >
                  Select Plan
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </motion.button>
              </div>
            </GlassContainer>
          ))}
        </div>

        {/* Active Vesting Positions */}
        {vestingPositions.length > 0 && (
          <GlassContainer animationDelay={0.5}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-crypto-400" />
                Your Vesting Positions
              </h2>

              <div className="space-y-4">
                {vestingPositions.map((position, index) => {
                  const plan = vestingPlans.find(p => p.id === position.planId);
                  const progress = plan ? 
                    Math.min(100, ((Date.now() - new Date(position.startDate).getTime()) / 
                    (new Date(position.endDate).getTime() - new Date(position.startDate).getTime())) * 100) : 0;

                  return (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="glass p-6 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${plan?.color || 'from-gray-400 to-gray-600'} rounded-full flex items-center justify-center text-xl`}>
                            {plan?.icon || '💰'}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{plan?.name || 'Unknown Plan'}</h3>
                            <p className="text-white/60">{position.amount} {position.asset}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">
                            ${position.currentValue.toLocaleString()}
                          </p>
                          <p className="text-white/60 text-sm">
                            +${position.earnedRewards.toFixed(2)} rewards
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-white/70 mb-2">
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-crypto-400 to-crypto-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-white/60 text-xs">Start Date</p>
                          <p className="text-white font-semibold">
                            {new Date(position.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">End Date</p>
                          <p className="text-white font-semibold">
                            {new Date(position.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">APY</p>
                          <p className="text-green-400 font-semibold">{plan?.apy}%</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Status</p>
                          <p className="text-green-400 font-semibold capitalize">{position.status}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassContainer>
        )}

        {/* Create Vesting Position Modal */}
        {showCreateModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <GlassContainer className="relative w-full max-w-md">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedPlan.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {selectedPlan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPlan.name}</h3>
                  <p className="text-white/70">Create new vesting position</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Select Asset</label>
                    <select
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    >
                      {selectedPlan.supportedAssets.map(asset => (
                        <option key={asset} value={asset} className="bg-gray-900">{asset}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Investment Amount (USD)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={`Min: $${selectedPlan.minInvestment}`}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    />
                    <p className="text-white/60 text-xs mt-1">
                      Range: ${selectedPlan.minInvestment.toLocaleString()} - ${selectedPlan.maxInvestment.toLocaleString()}
                    </p>
                  </div>

                  {investmentAmount && parseFloat(investmentAmount) >= selectedPlan.minInvestment && (
                    <div className="glass p-4 rounded-xl">
                      <h4 className="text-white font-semibold mb-2">Projected Returns</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Investment</span>
                          <span className="text-white">${parseFloat(investmentAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Duration</span>
                          <span className="text-white">{formatDuration(selectedPlan.duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Projected Profit</span>
                          <span className="text-green-400 font-semibold">
                            ${calculateProjectedReturn(selectedPlan, parseFloat(investmentAmount)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 glass-button py-3 text-white/70 hover:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateVestingPosition}
                    className={`flex-1 py-3 bg-gradient-to-r ${selectedPlan.color} text-white font-bold rounded-xl`}
                  >
                    Create Position
                  </motion.button>
                </div>
              </div>
            </GlassContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vesting;