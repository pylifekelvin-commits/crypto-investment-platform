import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store';
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Palette,
  Eye,
  EyeOff,
  Camera,
  Save,
  Smartphone,
  Key,
  AlertCircle,
  CheckCircle,
  Settings,
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, enable2FA, disable2FA } = useAuth();
  const { preferences, updatePreferences } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      await updateProfile(profileForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const qrUrl = await enable2FA();
      setQrCodeUrl(qrUrl);
      setShow2FASetup(true);
    } catch (error) {
      console.error('2FA setup failed:', error);
    }
  };

  const handleConfirm2FA = async () => {
    if (!twoFactorToken) {
      alert('Please enter the verification code');
      return;
    }

    try {
      // await verify2FA(twoFactorToken);
      setShow2FASetup(false);
      setTwoFactorToken('');
      alert('Two-factor authentication enabled successfully');
    } catch (error) {
      console.error('2FA verification failed:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2\">Account Settings</h1>
          <p className="text-white/70 text-lg">
            Manage your account, security settings, and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <GlassContainer animationDelay={0.1}>
              <div className="p-6">
                <div className="space-y-2">
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-crypto-500/30 text-white border border-crypto-500/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <GlassContainer animationDelay={0.3}>
              <div className="p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white\">Profile Information</h2>
                      {!isEditing ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="glass-button px-4 py-2 text-white hover:text-crypto-400"
                        >
                          Edit Profile
                        </motion.button>
                      ) : (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(false)}
                            className="glass-button px-4 py-2 text-white/70 hover:text-white"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleProfileUpdate}
                            disabled={isSaving}
                            className="bg-crypto-500 px-4 py-2 rounded-xl text-white hover:bg-crypto-600 transition-colors disabled:opacity-50"
                          >
                            {isSaving ? (
                              <div className="spinner w-4 h-4" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 inline mr-2" />
                                Save
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-full flex items-center justify-center">
                          <User className="w-12 h-12 text-white" />
                        </div>
                        {isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-crypto-500 rounded-full flex items-center justify-center text-white"
                          >
                            <Camera className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-white/70">{user?.email}</p>
                        <p className="text-white/50 text-sm">
                          Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/70 text-sm mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none transition-colors disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                    
                    {/* Password Change */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            placeholder="Current Password"
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                            className="w-full pl-12 pr-12 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5\" /> : <Eye className="w-5 h-5\" />}
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            placeholder="New Password"
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                            className="w-full pl-12 pr-12 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5\" /> : <Eye className="w-5 h-5\" />}
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                            className="w-full pl-12 pr-12 py-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5\" /> : <Eye className="w-5 h-5\" />}
                          </button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePasswordChange}
                          disabled={isSaving || !securityForm.currentPassword || !securityForm.newPassword}
                          className="bg-crypto-500 px-6 py-3 rounded-xl text-white hover:bg-crypto-600 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="spinner w-4 h-4" />
                          ) : (
                            'Update Password'
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4\">Two-Factor Authentication</h3>
                      <div className="glass p-4 rounded-xl mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-crypto-400" />
                            <div>
                              <p className="text-white font-medium\">Authenticator App</p>
                              <p className="text-white/70 text-sm\">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEnable2FA}
                            className="glass-button px-4 py-2 text-crypto-400 hover:bg-crypto-500/20"
                          >
                            Enable 2FA
                          </motion.button>
                        </div>
                      </div>

                      {/* 2FA Setup Modal */}
                      {show2FASetup && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                          <GlassContainer className="p-8 max-w-md mx-4">
                            <h3 className="text-xl font-bold text-white mb-4\">Setup Two-Factor Authentication</h3>
                            <div className="text-center mb-6">
                              <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full rounded-xl" />
                              </div>
                              <p className="text-white/70 text-sm">
                                Scan this QR code with your authenticator app
                              </p>
                            </div>
                            <div className="mb-6">
                              <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={twoFactorToken}
                                onChange={(e) => setTwoFactorToken(e.target.value)}
                                className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none text-center"
                                maxLength={6}
                              />
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShow2FASetup(false)}
                                className="flex-1 glass-button py-3 text-white/70"
                              >
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm2FA}
                                className="flex-1 bg-crypto-500 py-3 rounded-xl text-white hover:bg-crypto-600"
                              >
                                Verify & Enable
                              </motion.button>
                            </div>
                          </GlassContainer>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6\">Preferences</h2>
                    
                    {/* Video Settings */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4\">Video Background</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium\">Auto-play video</p>
                            <p className="text-white/70 text-sm\">Automatically play background video</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.autoPlayVideo}
                              onChange={(e) => updatePreferences({ autoPlayVideo: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crypto-500\"></div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-white/70 text-sm mb-2\">Video Volume</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={preferences.videoVolume}
                            onChange={(e) => updatePreferences({ videoVolume: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Animation Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4\">Animations</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium\">Enable animations</p>
                            <p className="text-white/70 text-sm\">Show smooth transitions and effects</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.enableAnimations}
                              onChange={(e) => updatePreferences({ enableAnimations: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crypto-500\"></div>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-white/70 text-sm mb-2\">Animation Speed</label>
                          <select
                            value={preferences.animationSpeed}
                            onChange={(e) => updatePreferences({ animationSpeed: e.target.value as 'slow' | 'normal' | 'fast' })}
                            className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                          >
                            <option value="slow" className="bg-gray-900">Slow</option>
                            <option value="normal" className="bg-gray-900">Normal</option>
                            <option value="fast" className="bg-gray-900">Fast</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6\">Notification Settings</h2>
                    
                    <div className="space-y-6">
                      {[
                        { id: 'price_alerts', title: 'Price Alerts', desc: 'Get notified when crypto prices change significantly' },
                        { id: 'portfolio_updates', title: 'Portfolio Updates', desc: 'Receive updates about your portfolio performance' },
                        { id: 'trade_confirmations', title: 'Trade Confirmations', desc: 'Get notified when trades are executed' },
                        { id: 'security_alerts', title: 'Security Alerts', desc: 'Important security notifications and login alerts' },
                        { id: 'news_updates', title: 'News & Market Updates', desc: 'Stay informed about crypto news and market trends' },
                      ].map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 glass rounded-xl"
                        >
                          <div>
                            <p className="text-white font-medium">{notification.title}</p>
                            <p className="text-white/70 text-sm">{notification.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crypto-500\"></div>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;