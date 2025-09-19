import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import AdminTaskCreator from '../components/AdminTaskCreator';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Award,
  DollarSign,
  Settings,
  CheckCircle,
  X,
  Crown,
  Shield,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Plus,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeTasks: number;
  pendingApprovals: number;
  totalPayouts: number;
  completedTasks: number;
}

interface PendingTask {
  id: string;
  userId: string;
  userName: string;
  taskTitle: string;
  reward: number;
  currency: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UserRanking {
  rank: number;
  userName: string;
  totalEarned: number;
  tasksCompleted: number;
  level: number;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'users' | 'rankings'>('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeTasks: 24,
    pendingApprovals: 8,
    totalPayouts: 45670.50,
    completedTasks: 3456,
  });
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskCreator, setShowTaskCreator] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@cryptovest.com';

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setPendingTasks([
        {
          id: '1',
          userId: 'u1',
          userName: 'John Doe',
          taskTitle: 'Learn About Bitcoin Basics',
          reward: 0.001,
          currency: 'BTC',
          submittedAt: new Date().toISOString(),
          status: 'pending',
        },
        {
          id: '2',
          userId: 'u2',
          userName: 'Jane Smith',
          taskTitle: 'Follow on Twitter',
          reward: 50,
          currency: 'VEST',
          submittedAt: new Date().toISOString(),
          status: 'pending',
        },
      ]);

      setRankings([
        { rank: 1, userName: 'CryptoKing', totalEarned: 1250.75, tasksCompleted: 89, level: 12 },
        { rank: 2, userName: 'BlockchainMaster', totalEarned: 1180.25, tasksCompleted: 76, level: 11 },
        { rank: 3, userName: 'CryptoExplorer', totalEarned: 1050.50, tasksCompleted: 68, level: 10 },
        { rank: 4, userName: 'DigitalNomad', totalEarned: 890.75, tasksCompleted: 54, level: 9 },
        { rank: 5, userName: 'TokenHunter', totalEarned: 780.25, tasksCompleted: 45, level: 8 },
        { rank: 6, userName: 'CryptoNewbie', totalEarned: 650.00, tasksCompleted: 38, level: 7 },
        { rank: 7, userName: 'InvestorPro', totalEarned: 580.50, tasksCompleted: 32, level: 6 },
        { rank: 8, userName: 'HODLer', totalEarned: 520.75, tasksCompleted: 29, level: 6 },
        { rank: 9, userName: 'MoonShooter', totalEarned: 475.25, tasksCompleted: 26, level: 5 },
        { rank: 10, userName: 'CryptoLearner', totalEarned: 425.00, tasksCompleted: 23, level: 5 },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const approveTask = async (taskId: string) => {
    setPendingTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, status: 'approved' } : task
      )
    );
  };

  const rejectTask = async (taskId: string) => {
    setPendingTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, status: 'rejected' } : task
      )
    );
  };

  const handleCreateTask = (taskData: any) => {
    console.log('Creating new task:', taskData);
    // Here you would call the API to create the task
    // For now, just log it
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/70 mb-4">Admin access required.</p>
          <p className="text-white/50 text-sm">Use admin@cryptovest.com to access admin panel</p>
        </GlassContainer>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <GlassContainer className="p-8">
          <div className="flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white text-lg">Loading admin panel...</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-crypto-400" />
                Admin Panel
              </h1>
              <p className="text-white/70 text-lg">
                Manage users, tasks, and platform operations.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadAdminData()}
              className="glass-button px-4 py-2 text-white hover:text-crypto-400 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'rankings', label: 'Rankings', icon: Crown },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-crypto-500 text-white'
                  : 'glass-button text-white/70 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'tasks' && adminStats.pendingApprovals > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {adminStats.pendingApprovals}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <GlassContainer animationDelay={0.2}>
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{adminStats.totalUsers.toLocaleString()}</h3>
                    <p className="text-white/70">Total Users</p>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm">+8%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{adminStats.completedTasks.toLocaleString()}</h3>
                    <p className="text-white/70">Completed Tasks</p>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-red-400 text-sm">Urgent</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{adminStats.pendingApprovals}</h3>
                    <p className="text-white/70">Pending Approvals</p>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-400 text-sm">+15%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">${adminStats.totalPayouts.toLocaleString()}</h3>
                    <p className="text-white/70">Total Payouts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Task Management */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Task Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTaskCreator(true)}
                    className="bg-crypto-500 px-4 py-2 rounded-xl text-white hover:bg-crypto-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Task
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`glass p-4 rounded-xl border-l-4 ${
                        task.status === 'approved' ? 'border-green-500' :
                        task.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{task.taskTitle}</h3>
                          <p className="text-white/70 text-sm mb-2">User: {task.userName}</p>
                          <span className="text-crypto-400 font-semibold">
                            Reward: +{task.reward} {task.currency}
                          </span>
                        </div>
                        {task.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => approveTask(task.id)}
                              className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => rejectTask(task.id)}
                              className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                        {task.status !== 'pending' && (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            task.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {task.status}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="glass p-4 rounded-xl">
                  <p className="text-white/70 text-center py-8">
                    User management features coming soon...
                    <br />
                    Will include user suspension, banning, and detailed user analytics.
                  </p>
                </div>
              </div>
            )}

            {/* Rankings */}
            {activeTab === 'rankings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Top 10 User Rankings</h2>
                <div className="space-y-3">
                  {rankings.map((user) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: user.rank * 0.05 }}
                      className="glass p-4 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-blue-400 to-blue-600'
                          }`}>
                            {user.rank <= 3 ? (
                              <Crown className="w-6 h-6 text-white" />
                            ) : (
                              <span className="text-white font-bold">#{user.rank}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{user.userName}</h3>
                            <p className="text-white/60 text-sm">{user.tasksCompleted} tasks completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-crypto-400 font-bold">${user.totalEarned.toFixed(2)}</p>
                          <p className="text-white/60 text-sm">Level {user.level}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassContainer>

        {/* Task Creator Modal */}
        <AdminTaskCreator
          isOpen={showTaskCreator}
          onClose={() => setShowTaskCreator(false)}
          onSave={handleCreateTask}
        />
      </div>
    </div>
  );
};

export default AdminPanel;