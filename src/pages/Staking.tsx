import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useNotifications } from '../components/NotificationSystem';
import {
  Zap,
  TrendingUp,
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  Shield,
  Target,
  Award,
  ArrowRight,
  Clock,
  Activity,
  Coins,
  Star,
} from 'lucide-react';
import { StakingPool, StakingPosition } from '../types';

const Staking: React.FC = () => {
  const { 
    stakingPools, 
    stakingPositions, 
    setStakingPools, 
    addStakingPosition,
    user 
  } = useAppStore();
  const { showNotification } = useNotifications();
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);

  // Initialize staking pools
  useEffect(() => {
    const pools: StakingPool[] = [
      {
        id: 'btc_pool',
        name: 'Bitcoin Staking Pool',
        asset: 'BTC',
        apy: 6.8,
        totalStaked: 1250000,
        minStake: 0.001,
        lockPeriod: 30,
        rewardFrequency: 'daily',
        description: 'Secure Bitcoin staking with daily rewards and flexible terms',
        riskLevel: 'low',
        icon: '₿'
      },
      {
        id: 'eth_pool',
        name: 'Ethereum 2.0 Staking',
        asset: 'ETH',
        apy: 8.2,
        totalStaked: 2800000,
        minStake: 0.01,
        lockPeriod: 60,
        rewardFrequency: 'daily',
        description: 'Participate in Ethereum 2.0 consensus with competitive rewards',
        riskLevel: 'low',
        icon: 'Ξ'
      },
      {
        id: 'bnb_pool',
        name: 'BNB Flexible Staking',
        asset: 'BNB',
        apy: 12.5,
        totalStaked: 850000,
        minStake: 1,
        lockPeriod: 7,
        rewardFrequency: 'daily',
        description: 'High-yield BNB staking with weekly lock periods',
        riskLevel: 'medium',
        icon: '◊'
      },
      {
        id: 'ada_pool',
        name: 'Cardano Delegation Pool',
        asset: 'ADA',
        apy: 15.3,
        totalStaked: 450000,
        minStake: 10,
        lockPeriod: 0,
        rewardFrequency: 'weekly',
        description: 'Delegate ADA with no lock period and weekly rewards',
        riskLevel: 'medium',
        icon: '⟐'
      },
      {
        id: 'sol_pool',
        name: 'Solana Validator Pool',
        asset: 'SOL',
        apy: 18.7,
        totalStaked: 320000,
        minStake: 1,
        lockPeriod: 90,
        rewardFrequency: 'daily',
        description: 'High-performance Solana staking with premium rewards',
        riskLevel: 'high',
        icon: '◎'
      },
      {
        id: 'dot_pool',
        name: 'Polkadot Nominator Pool',
        asset: 'DOT',
        apy: 14.2,
        totalStaked: 180000,
        minStake: 1,
        lockPeriod: 28,
        rewardFrequency: 'daily',
        description: 'Participate in Polkadot network consensus and earn rewards',
        riskLevel: 'medium',
        icon: '●'
      }
    ];
    setStakingPools(pools);
  }, [setStakingPools]);

  const handleStake = () => {
    if (!selectedPool || !stakeAmount || !user) {
      showNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please select a pool and enter stake amount'
      });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (amount < selectedPool.minStake) {
      showNotification({
        type: 'error',
        title: 'Insufficient Amount',
        message: `Minimum stake is ${selectedPool.minStake} ${selectedPool.asset}`
      });
      return;
    }

    const position: StakingPosition = {
      id: `stake_${Date.now()}`,
      userId: user.id,
      poolId: selectedPool.id,
      amount,
      startDate: new Date().toISOString(),
      endDate: selectedPool.lockPeriod > 0 
        ? new Date(Date.now() + selectedPool.lockPeriod * 24 * 60 * 60 * 1000).toISOString()
        : new Date().toISOString(),
      status: 'active',
      earnedRewards: 0,
      lastRewardDate: new Date().toISOString(),
      autoCompound: true
    };

    addStakingPosition(position);
    setShowStakeModal(false);
    setStakeAmount('');
    
    showNotification({
      type: 'success',
      title: 'Staking Position Created!',
      message: `Successfully staked ${amount} ${selectedPool.asset} in ${selectedPool.name}`
    });
  };

  const calculateDailyRewards = (pool: StakingPool, amount: number) => {
    return (amount * pool.apy / 100) / 365;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatLockPeriod = (days: number) => {
    if (days === 0) return 'No lock';
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
  };

  const totalStakedValue = stakingPositions.reduce((total, pos) => {
    const pool = stakingPools.find(p => p.id === pos.poolId);
    return total + pos.amount;
  }, 0);

  const totalEarnedRewards = stakingPositions.reduce((total, pos) => total + pos.earnedRewards, 0);

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
              <Zap className="w-8 h-8 text-crypto-400" />
              Crypto Staking
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStakeModal(true)}
              className="glass-button px-6 py-3 text-white hover:text-crypto-400 flex items-center gap-2"
            >
              <Coins className="w-5 h-5" />
              Start Staking
            </motion.button>
          </div>
          <p className="text-white/70 text-lg">
            Earn passive income by staking your crypto assets. Choose from various pools with different risk levels and rewards.
          </p>
        </motion.div>

        {/* Staking Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassContainer animationDelay={0.1} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Total Staked</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Your Staking Value</h3>
              <p className="text-3xl font-bold text-white">
                ${totalStakedValue.toLocaleString()}
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.2} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">Rewards</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Total Earned</h3>
              <p className="text-3xl font-bold text-green-400">
                ${totalEarnedRewards.toFixed(2)}
              </p>
            </div>
          </GlassContainer>

          <GlassContainer animationDelay={0.3} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-400 text-sm font-medium">Active</span>
              </div>
              <h3 className="text-white/70 text-sm mb-1">Active Positions</h3>
              <p className="text-3xl font-bold text-white">
                {stakingPositions.length}
              </p>
            </div>
          </GlassContainer>
        </div>

        {/* Staking Pools */}
        <GlassContainer animationDelay={0.4}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-crypto-400" />
              Available Staking Pools
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass p-6 rounded-xl hover:bg-white/25 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {pool.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{pool.name}</h3>
                        <p className="text-white/60">{pool.asset}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-2xl">{pool.apy}%</p>
                      <p className="text-white/60 text-sm">APY</p>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{pool.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="glass p-3 rounded-xl">
                      <p className="text-white/60 text-xs">Min Stake</p>
                      <p className="text-white font-semibold">{pool.minStake} {pool.asset}</p>
                    </div>
                    <div className="glass p-3 rounded-xl">
                      <p className="text-white/60 text-xs">Lock Period</p>
                      <p className="text-white font-semibold">{formatLockPeriod(pool.lockPeriod)}</p>
                    </div>
                    <div className="glass p-3 rounded-xl">
                      <p className="text-white/60 text-xs">Rewards</p>
                      <p className="text-white font-semibold capitalize">{pool.rewardFrequency}</p>
                    </div>
                    <div className="glass p-3 rounded-xl">
                      <p className="text-white/60 text-xs">Total Staked</p>
                      <p className="text-white font-semibold">${(pool.totalStaked / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getRiskBadgeColor(pool.riskLevel)}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {pool.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="text-white/70 text-sm flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Popular
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPool(pool);
                      setShowStakeModal(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-crypto-400 to-crypto-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    Stake Now
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassContainer>

        {/* Active Staking Positions */}
        {stakingPositions.length > 0 && (
          <GlassContainer animationDelay={0.6} className="mt-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-crypto-400" />
                Your Staking Positions
              </h2>

              <div className="space-y-4">
                {stakingPositions.map((position, index) => {
                  const pool = stakingPools.find(p => p.id === position.poolId);
                  const isLocked = position.endDate && new Date(position.endDate) > new Date();
                  const timeLeft = isLocked ? 
                    Math.ceil((new Date(position.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

                  return (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="glass p-6 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center text-white font-bold">
                            {pool?.icon || '💰'}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{pool?.name || 'Unknown Pool'}</h3>
                            <p className="text-white/60">{position.amount} {pool?.asset}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">
                            +${position.earnedRewards.toFixed(4)}
                          </p>
                          <p className="text-white/60 text-sm">Earned rewards</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-white/60 text-xs">APY</p>
                          <p className="text-green-400 font-semibold">{pool?.apy}%</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Daily Rewards</p>
                          <p className="text-white font-semibold">
                            {pool ? calculateDailyRewards(pool, position.amount).toFixed(6) : '0'} {pool?.asset}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Status</p>
                          <div className="flex items-center justify-center gap-1">
                            {isLocked ? <Lock className="w-3 h-3 text-yellow-400" /> : <Unlock className="w-3 h-3 text-green-400" />}
                            <span className={`font-semibold ${isLocked ? 'text-yellow-400' : 'text-green-400'}`}>
                              {isLocked ? `${timeLeft}d left` : 'Unlocked'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Auto Compound</p>
                          <p className={`font-semibold ${position.autoCompound ? 'text-green-400' : 'text-white'}`}>
                            {position.autoCompound ? 'ON' : 'OFF'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 glass-button py-2 text-white hover:text-green-400"
                        >
                          Claim Rewards
                        </motion.button>
                        {!isLocked && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 glass-button py-2 text-white hover:text-red-400"
                          >
                            Unstake
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassContainer>
        )}

        {/* Stake Modal */}
        {showStakeModal && selectedPool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStakeModal(false)} />
            <GlassContainer className="relative w-full max-w-md">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    {selectedPool.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedPool.name}</h3>
                  <p className="text-white/70">Stake {selectedPool.asset} and earn rewards</p>
                </div>

                <div className="space-y-4">
                  <div className="glass p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">APY</span>
                        <span className="text-green-400 font-semibold">{selectedPool.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Lock Period</span>
                        <span className="text-white font-semibold">{formatLockPeriod(selectedPool.lockPeriod)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Min Stake</span>
                        <span className="text-white font-semibold">{selectedPool.minStake} {selectedPool.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Rewards</span>
                        <span className="text-white font-semibold capitalize">{selectedPool.rewardFrequency}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Stake Amount ({selectedPool.asset})
                    </label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Min: ${selectedPool.minStake}`}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    />
                  </div>

                  {stakeAmount && parseFloat(stakeAmount) >= selectedPool.minStake && (
                    <div className="glass p-4 rounded-xl">
                      <h4 className="text-white font-semibold mb-2">Projected Rewards</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Daily Rewards</span>
                          <span className="text-green-400">
                            {calculateDailyRewards(selectedPool, parseFloat(stakeAmount)).toFixed(6)} {selectedPool.asset}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Monthly Rewards</span>
                          <span className="text-green-400">
                            {(calculateDailyRewards(selectedPool, parseFloat(stakeAmount)) * 30).toFixed(4)} {selectedPool.asset}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Annual Rewards</span>
                          <span className="text-green-400">
                            {(parseFloat(stakeAmount) * selectedPool.apy / 100).toFixed(2)} {selectedPool.asset}
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
                    onClick={() => setShowStakeModal(false)}
                    className="flex-1 glass-button py-3 text-white/70 hover:text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStake}
                    className="flex-1 py-3 bg-gradient-to-r from-crypto-400 to-crypto-600 text-white font-bold rounded-xl"
                  >
                    Stake Now
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

export default Staking;