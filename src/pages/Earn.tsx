import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import {
  Play,
  CheckCircle,
  Clock,
  Coins,
  Youtube,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  Gift,
  TrendingUp,
  Star,
  Award,
  Zap,
} from 'lucide-react';

interface EarnTask {
  id: string;
  type: 'video' | 'social';
  title: string;
  description: string;
  reward: number;
  currency: string;
  timeRequired: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'available' | 'in_progress' | 'completed' | 'claimed';
  videoUrl?: string;
  socialPlatform?: string;
  socialAction?: string;
  socialUrl?: string;
  completedAt?: string;
  progress?: number; // percentage for video watching
}

interface UserEarnings {
  totalEarned: number;
  availableBalance: number;
  completedTasks: number;
  currentStreak: number;
  level: number;
  xp: number;
}

const Earn: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'videos' | 'social' | 'achievements'>('videos');
  const [tasks, setTasks] = useState<EarnTask[]>([]);
  const [earnings, setEarnings] = useState<UserEarnings>({
    totalEarned: 0,
    availableBalance: 0,
    completedTasks: 0,
    currentStreak: 0,
    level: 1,
    xp: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<EarnTask | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);

  useEffect(() => {
    loadTasks();
    loadEarnings();
  }, []);

  const loadTasks = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockTasks: EarnTask[] = [
        {
          id: '1',
          type: 'video',
          title: 'Learn About Bitcoin Basics',
          description: 'Watch this 5-minute educational video about Bitcoin fundamentals',
          reward: 0.001,
          currency: 'BTC',
          timeRequired: 5,
          difficulty: 'easy',
          status: 'available',
          videoUrl: 'https://www.youtube.com/embed/41JCpzvnn_0',
        },
        {
          id: '2',
          type: 'video',
          title: 'DeFi Explained',
          description: 'Understanding Decentralized Finance and its benefits',
          reward: 0.01,
          currency: 'ETH',
          timeRequired: 8,
          difficulty: 'medium',
          status: 'available',
          videoUrl: 'https://www.youtube.com/embed/k9HYC0EJU6E',
        },
        {
          id: '3',
          type: 'social',
          title: 'Follow on Twitter',
          description: 'Follow @CryptoVest on Twitter',
          reward: 50,
          currency: 'VEST',
          timeRequired: 1,
          difficulty: 'easy',
          status: 'available',
          socialPlatform: 'twitter',
          socialAction: 'follow',
          socialUrl: 'https://twitter.com/cryptovest',
        },
        {
          id: '4',
          type: 'social',
          title: 'Share on Facebook',
          description: 'Share CryptoVest platform on your Facebook',
          reward: 100,
          currency: 'VEST',
          timeRequired: 2,
          difficulty: 'easy',
          status: 'available',
          socialPlatform: 'facebook',
          socialAction: 'share',
          socialUrl: 'https://facebook.com/share',
        },
        {
          id: '5',
          type: 'video',
          title: 'Advanced Trading Strategies',
          description: 'Learn advanced crypto trading techniques',
          reward: 0.05,
          currency: 'ETH',
          timeRequired: 15,
          difficulty: 'hard',
          status: 'available',
          videoUrl: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
        },
        {
          id: '6',
          type: 'social',
          title: 'Instagram Story',
          description: 'Post about CryptoVest in your Instagram story',
          reward: 75,
          currency: 'VEST',
          timeRequired: 3,
          difficulty: 'medium',
          status: 'available',
          socialPlatform: 'instagram',
          socialAction: 'story',
          socialUrl: 'https://instagram.com',
        },
      ];
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  };

  const loadEarnings = async () => {
    // Simulate loading user earnings
    setTimeout(() => {
      setEarnings({
        totalEarned: 234.56,
        availableBalance: 189.23,
        completedTasks: 12,
        currentStreak: 3,
        level: 4,
        xp: 1250,
      });
    }, 800);
  };

  const startTask = (task: EarnTask) => {
    setSelectedTask(task);
    if (task.type === 'video') {
      // Update task status to in_progress
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: 'in_progress' } : t
      ));
    }
  };

  const completeVideoTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        status: 'completed',
        completedAt: new Date().toISOString(),
        progress: 100
      } : t
    ));
    setSelectedTask(null);
    setWatchProgress(0);
    
    // Update earnings
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEarnings(prev => ({
        ...prev,
        totalEarned: prev.totalEarned + task.reward,
        availableBalance: prev.availableBalance + task.reward,
        completedTasks: prev.completedTasks + 1,
        xp: prev.xp + (task.difficulty === 'easy' ? 50 : task.difficulty === 'medium' ? 100 : 200),
      }));
    }
  };

  const completeSocialTask = (taskId: string) => {
    // Open social platform in new tab
    const task = tasks.find(t => t.id === taskId);
    if (task?.socialUrl) {
      window.open(task.socialUrl, '_blank');
    }
    
    // Mark as completed after a delay (simulating user action)
    setTimeout(() => {
      setTasks(tasks.map(t => 
        t.id === taskId ? { 
          ...t, 
          status: 'completed',
          completedAt: new Date().toISOString()
        } : t
      ));
      
      if (task) {
        setEarnings(prev => ({
          ...prev,
          totalEarned: prev.totalEarned + task.reward,
          availableBalance: prev.availableBalance + task.reward,
          completedTasks: prev.completedTasks + 1,
          xp: prev.xp + (task.difficulty === 'easy' ? 25 : task.difficulty === 'medium' ? 50 : 100),
        }));
      }
    }, 3000);
  };

  const claimReward = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'claimed' } : t
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Star className="w-4 h-4" />;
      case 'medium': return <Award className="w-4 h-4" />;
      case 'hard': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      default: return <Share2 className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Play className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'claimed': return <Gift className="w-4 h-4 text-purple-400" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const videoTasks = tasks.filter(task => task.type === 'video');
  const socialTasks = tasks.filter(task => task.type === 'social');

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white text-lg">Loading earning opportunities...</span>
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
          <h1 className="text-4xl font-bold text-white mb-2">Earn Crypto</h1>
          <p className="text-white/70 text-lg">
            Watch videos and complete social tasks to earn cryptocurrency rewards.
          </p>
        </motion.div>

        {/* Earnings Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <GlassContainer className="p-6 text-center">
            <Coins className="w-8 h-8 text-crypto-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">${earnings.totalEarned.toFixed(2)}</h3>
            <p className="text-white/70">Total Earned</p>
          </GlassContainer>
          
          <GlassContainer className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">${earnings.availableBalance.toFixed(2)}</h3>
            <p className="text-white/70">Available Balance</p>
          </GlassContainer>
          
          <GlassContainer className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{earnings.completedTasks}</h3>
            <p className="text-white/70">Tasks Completed</p>
          </GlassContainer>
          
          <GlassContainer className="p-6 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">Level {earnings.level}</h3>
            <p className="text-white/70">{earnings.xp} XP</p>
          </GlassContainer>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-crypto-500 text-white'
                : 'glass-button text-white/70 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4" />
            Watch Videos
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('social')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'social'
                ? 'bg-crypto-500 text-white'
                : 'glass-button text-white/70 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social Tasks
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'bg-crypto-500 text-white'
                : 'glass-button text-white/70 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Achievements
          </motion.button>
        </div>

        <GlassContainer animationDelay={0.2}>
          <div className="p-6">
            {/* Video Tasks Tab */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Youtube className="w-6 h-6 text-red-500" />
                  Educational Videos
                </h2>
                {videoTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{task.title}</h3>
                          <span className={`flex items-center gap-1 text-sm ${getDifficultyColor(task.difficulty)}`}>
                            {getDifficultyIcon(task.difficulty)}
                            {task.difficulty}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-crypto-400 font-semibold">
                            +{task.reward} {task.currency}
                          </span>
                          <span className="text-white/60">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {task.timeRequired} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {task.status === 'available' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startTask(task)}
                            className="bg-crypto-500 px-4 py-2 rounded-lg text-white hover:bg-crypto-600"
                          >
                            Watch
                          </motion.button>
                        )}
                        {task.status === 'completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => claimReward(task.id)}
                            className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600"
                          >
                            Claim
                          </motion.button>
                        )}
                        {task.status === 'claimed' && (
                          <span className="text-purple-400 font-medium">Claimed</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Social Tasks Tab */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-blue-500" />
                  Social Media Tasks
                </h2>
                {socialTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {task.socialPlatform && getSocialIcon(task.socialPlatform)}
                          <h3 className="text-white font-semibold">{task.title}</h3>
                          <span className={`flex items-center gap-1 text-sm ${getDifficultyColor(task.difficulty)}`}>
                            {getDifficultyIcon(task.difficulty)}
                            {task.difficulty}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-crypto-400 font-semibold">
                            +{task.reward} {task.currency}
                          </span>
                          <span className="text-white/60">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {task.timeRequired} min
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {task.status === 'available' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => completeSocialTask(task.id)}
                            className="bg-crypto-500 px-4 py-2 rounded-lg text-white hover:bg-crypto-600"
                          >
                            Complete
                          </motion.button>
                        )}
                        {task.status === 'completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => claimReward(task.id)}
                            className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600"
                          >
                            Claim
                          </motion.button>
                        )}
                        {task.status === 'claimed' && (
                          <span className="text-purple-400 font-medium">Claimed</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  Achievements & Rewards
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Level Progress</span>
                          <span className="text-white">{earnings.xp}/2000 XP</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-crypto-500 h-2 rounded-full" 
                            style={{ width: `${(earnings.xp / 2000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Current Streak</span>
                          <span className="text-white">{earnings.currentStreak} days</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(earnings.currentStreak / 7) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Complete first task</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-white">Watch 5 videos</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-white/50" />
                        <span className="text-white/70">Complete 10 social tasks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-white/50" />
                        <span className="text-white/70">Reach Level 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassContainer>

        {/* Video Modal */}
        {selectedTask && selectedTask.type === 'video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedTask.title}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-white/50 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video mb-4">
                <iframe
                  src={selectedTask.videoUrl}
                  className="w-full h-full rounded-xl"
                  frameBorder="0"
                  allowFullScreen
                  title={selectedTask.title}
                ></iframe>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 mb-2">{selectedTask.description}</p>
                  <p className="text-crypto-400 font-semibold">
                    Reward: +{selectedTask.reward} {selectedTask.currency}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => completeVideoTask(selectedTask.id)}
                  className="bg-green-500 px-6 py-3 rounded-xl text-white hover:bg-green-600"
                >
                  Mark as Watched
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Earn;