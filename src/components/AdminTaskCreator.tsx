import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import {
  Plus,
  Save,
  X,
  Youtube,
  Twitter,
  Facebook,
  Instagram,
  Globe,
} from 'lucide-react';

interface TaskFormData {
  title: string;
  description: string;
  type: 'video' | 'social';
  reward: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  timeRequired: number;
  difficulty: 'easy' | 'medium' | 'hard';
  videoUrl?: string;
  socialPlatform?: string;
  socialAction?: string;
  socialUrl?: string;
}

interface AdminTaskCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
}

const AdminTaskCreator: React.FC<AdminTaskCreatorProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    type: 'video',
    reward: 0,
    currency: 'VEST',
    timeRequired: 5,
    difficulty: 'easy',
    videoUrl: '',
    socialPlatform: 'twitter',
    socialAction: 'follow',
    socialUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'video',
      reward: 0,
      currency: 'VEST',
      timeRequired: 5,
      difficulty: 'easy',
      videoUrl: '',
      socialPlatform: 'twitter',
      socialAction: 'follow',
      socialUrl: '',
    });
  };

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassContainer>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-crypto-400" />
                Create New Task
              </h2>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Type */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Task Type</label>
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('type', 'video')}
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      formData.type === 'video'
                        ? 'bg-crypto-500/20 border-crypto-500 text-white'
                        : 'glass border-white/20 text-white/70'
                    }`}
                  >
                    <Youtube className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Video Task</p>
                    <p className="text-xs opacity-70">Watch educational content</p>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('type', 'social')}
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      formData.type === 'social'
                        ? 'bg-crypto-500/20 border-crypto-500 text-white'
                        : 'glass border-white/20 text-white/70'
                    }`}
                  >
                    <Twitter className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Social Task</p>
                    <p className="text-xs opacity-70">Social media engagement</p>
                  </motion.button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                  >
                    <option value="easy" className="bg-gray-900">Easy</option>
                    <option value="medium" className="bg-gray-900">Medium</option>
                    <option value="hard" className="bg-gray-900">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none resize-none"
                  placeholder="Describe what users need to do..."
                  required
                />
              </div>

              {/* Reward Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Reward Amount</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.reward}
                    onChange={(e) => handleInputChange('reward', parseFloat(e.target.value))}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    placeholder="0.001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                  >
                    <option value="BTC" className="bg-gray-900">BTC</option>
                    <option value="ETH" className="bg-gray-900">ETH</option>
                    <option value="VEST" className="bg-gray-900">VEST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Time Required (min)</label>
                  <input
                    type="number"
                    value={formData.timeRequired}
                    onChange={(e) => handleInputChange('timeRequired', parseInt(e.target.value))}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              {/* Type-specific fields */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-white/70 text-sm mb-2">YouTube Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
              )}

              {formData.type === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Social Platform</label>
                    <select
                      value={formData.socialPlatform}
                      onChange={(e) => handleInputChange('socialPlatform', e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    >
                      <option value="twitter" className="bg-gray-900">Twitter</option>
                      <option value="facebook" className="bg-gray-900">Facebook</option>
                      <option value="instagram" className="bg-gray-900">Instagram</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Action</label>
                    <select
                      value={formData.socialAction}
                      onChange={(e) => handleInputChange('socialAction', e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                    >
                      <option value="follow" className="bg-gray-900">Follow</option>
                      <option value="share" className="bg-gray-900">Share</option>
                      <option value="like" className="bg-gray-900">Like</option>
                      <option value="comment" className="bg-gray-900">Comment</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm mb-2">Social URL</label>
                    <input
                      type="url"
                      value={formData.socialUrl}
                      onChange={(e) => handleInputChange('socialUrl', e.target.value)}
                      className="w-full p-3 glass rounded-xl text-white bg-transparent border border-white/20 focus:border-crypto-500 outline-none"
                      placeholder="https://twitter.com/cryptovest"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 glass-button py-3 text-white/70 hover:text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-crypto-500 py-3 rounded-xl text-white hover:bg-crypto-600 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create Task
                </motion.button>
              </div>
            </form>
          </div>
        </GlassContainer>
      </motion.div>
    </motion.div>
  );
};

export default AdminTaskCreator;