import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../components/GlassContainer';
import {
  BookOpen,
  Play,
  Clock,
  TrendingUp,
  Shield,
  DollarSign,
  Lightbulb,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';

const Education: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'beginner', name: 'Beginner', icon: Lightbulb },
    { id: 'trading', name: 'Trading', icon: TrendingUp },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'advanced', name: 'Advanced', icon: Users },
  ];

  const articles = [
    {
      id: 1,
      title: 'Complete Guide to Cryptocurrency Investing for Beginners',
      summary: 'Learn the fundamentals of crypto investing, from wallet setup to your first purchase.',
      category: 'beginner',
      readTime: 8,
      level: 'Beginner',
      image: '🚀',
      author: 'CryptoVest Team',
      rating: 4.9,
    },
    {
      id: 2,
      title: 'Understanding Bitcoin: Digital Gold or Payment System?',
      summary: 'Explore Bitcoin\'s dual nature as both a store of value and payment network.',
      category: 'beginner',
      readTime: 12,
      level: 'Beginner',
      image: '₿',
      author: 'Sarah Chen',
      rating: 4.8,
    },
    {
      id: 3,
      title: 'Technical Analysis: Reading Crypto Charts Like a Pro',
      summary: 'Master candlestick patterns, indicators, and chart analysis for better trading decisions.',
      category: 'trading',
      readTime: 15,
      level: 'Intermediate',
      image: '📈',
      author: 'Mike Thompson',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Crypto Security Best Practices: Protect Your Investments',
      summary: 'Essential security measures to keep your cryptocurrency safe from hackers and scams.',
      category: 'security',
      readTime: 10,
      level: 'Beginner',
      image: '🔒',
      author: 'Security Expert',
      rating: 4.9,
    },
    {
      id: 5,
      title: 'DeFi Deep Dive: Yield Farming and Liquidity Pools',
      summary: 'Advanced strategies for earning passive income through decentralized finance.',
      category: 'advanced',
      readTime: 20,
      level: 'Advanced',
      image: '🌾',
      author: 'DeFi Researcher',
      rating: 4.6,
    },
    {
      id: 6,
      title: 'Portfolio Diversification in Crypto: Risk Management 101',
      summary: 'Learn how to build a balanced crypto portfolio and manage investment risks.',
      category: 'trading',
      readTime: 12,
      level: 'Intermediate',
      image: '⚖️',
      author: 'Investment Advisor',
      rating: 4.8,
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'How to Make Your First Crypto Purchase',
      duration: '5 min',
      level: 'Beginner',
      thumbnail: '🛒',
      completed: false,
    },
    {
      id: 2,
      title: 'Setting Up a Secure Crypto Wallet',
      duration: '8 min',
      level: 'Beginner',
      thumbnail: '👛',
      completed: false,
    },
    {
      id: 3,
      title: 'Understanding Market Orders vs Limit Orders',
      duration: '6 min',
      level: 'Intermediate',
      thumbnail: '📊',
      completed: false,
    },
    {
      id: 4,
      title: 'Reading Cryptocurrency White Papers',
      duration: '12 min',
      level: 'Advanced',
      thumbnail: '📄',
      completed: false,
    },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Education Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-crypto-400" />
            Learn Cryptocurrency
          </h1>
          <p className="text-white/70 text-lg">
            Master crypto investing with our comprehensive guides, tutorials, and expert insights.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassContainer animationDelay={0.1}>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-white/70 text-sm">Articles</div>
            </div>
          </GlassContainer>
          <GlassContainer animationDelay={0.2}>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">25+</div>
              <div className="text-white/70 text-sm">Video Tutorials</div>
            </div>
          </GlassContainer>
          <GlassContainer animationDelay={0.3}>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">100K+</div>
              <div className="text-white/70 text-sm">Students</div>
            </div>
          </GlassContainer>
          <GlassContainer animationDelay={0.4}>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">4.8★</div>
              <div className="text-white/70 text-sm">Rating</div>
            </div>
          </GlassContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div>
            <GlassContainer animationDelay={0.5}>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? 'bg-crypto-500/30 text-white border border-crypto-500/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassContainer>

            {/* Video Tutorials */}
            <GlassContainer animationDelay={0.7} className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-crypto-400" />
                  Video Tutorials
                </h3>
                <div className="space-y-3">
                  {tutorials.map((tutorial, index) => (
                    <motion.div
                      key={tutorial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="glass p-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                          {tutorial.thumbnail}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium truncate">
                            {tutorial.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/60 text-xs">{tutorial.duration}</span>
                            <span className={`text-xs ${getLevelColor(tutorial.level)}`}>
                              {tutorial.level}
                            </span>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-crypto-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <GlassContainer hover className="h-full">
                    <div className="p-6 h-full flex flex-col">
                      {/* Article Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-crypto-400 to-crypto-600 rounded-xl flex items-center justify-center text-xl">
                          {article.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(article.level)} bg-current/20`}>
                              {article.level}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">{article.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-white font-bold text-lg leading-tight mb-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      {/* Article Content */}
                      <p className="text-white/70 text-sm mb-4 flex-1">
                        {article.summary}
                      </p>

                      {/* Article Footer */}
                      <div className="border-t border-white/10 pt-4 mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime} min read</span>
                          </div>
                          <span className="text-white/60 text-xs">{article.author}</span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full glass-button p-3 text-white hover:text-crypto-400 flex items-center justify-center gap-2"
                        >
                          <span>Read Article</span>
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </GlassContainer>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-8 py-4 text-white hover:text-crypto-400"
              >
                Load More Articles
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;