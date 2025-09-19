import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Grid3X3, List, Heart, Eye, Upload, Palette, 
  ShoppingCart, Gavel, Star, Filter, Plus, TrendingUp, Users, Zap, ArrowLeft 
} from 'lucide-react';
import GlassContainer from '../components/GlassContainer';
import { useAppStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { NFT } from '../types';

interface NFTData {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  owner: string;
  price?: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  isForSale: boolean;
  isAuction: boolean;
  category: 'art' | 'gaming' | 'music' | 'utility' | 'collectible';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  traits: { trait_type: string; value: string }[];
  createdAt: string;
  royalty: number;
  totalViews: number;
  totalLikes: number;
  liked?: boolean;
}

const NFTMarketplace: React.FC = () => {
  const { user } = useAuth();
  const { gameWallet, updateGameBalance } = useAppStore();
  const [activeTab, setActiveTab] = useState<'explore' | 'collections' | 'create' | 'my-nfts'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'art' | 'gaming' | 'music' | 'utility' | 'collectible'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular'>('newest');
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock NFT data
  useEffect(() => {
    const mockNFTs: NFTData[] = [
      {
        id: 'nft_1',
        tokenId: '1001',
        name: 'Crypto Punk Genesis',
        description: 'A rare genesis crypto punk from the original collection',
        image: '🎭',
        creator: 'CryptoPunkArtist',
        owner: 'user123',
        price: 0.05,
        currency: 'ETH',
        isForSale: true,
        isAuction: false,
        category: 'art',
        rarity: 'legendary',
        traits: [
          { trait_type: 'Background', value: 'Blue' },
          { trait_type: 'Eyes', value: 'Laser' },
          { trait_type: 'Mouth', value: 'Smile' }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        royalty: 10,
        totalViews: 1250,
        totalLikes: 89,
        liked: false
      },
      {
        id: 'nft_2',
        tokenId: '1002',
        name: 'Gaming Sword of Power',
        description: 'Legendary sword NFT for use in metaverse games',
        image: '⚔️',
        creator: 'GameDevStudio',
        owner: 'gamer456',
        price: 0.02,
        currency: 'ETH',
        isForSale: true,
        isAuction: true,
        category: 'gaming',
        rarity: 'epic',
        traits: [
          { trait_type: 'Damage', value: '150' },
          { trait_type: 'Element', value: 'Fire' },
          { trait_type: 'Durability', value: '100' }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        royalty: 5,
        totalViews: 890,
        totalLikes: 67,
        liked: true
      },
      {
        id: 'nft_3',
        tokenId: '1003',
        name: 'Digital Music Beat',
        description: 'Exclusive electronic music NFT with commercial rights',
        image: '🎵',
        creator: 'BeatMaker2024',
        owner: 'musiclover',
        price: 100,
        currency: 'VEST',
        isForSale: true,
        isAuction: false,
        category: 'music',
        rarity: 'rare',
        traits: [
          { trait_type: 'BPM', value: '128' },
          { trait_type: 'Genre', value: 'Electronic' },
          { trait_type: 'Duration', value: '3:45' }
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        royalty: 15,
        totalViews: 456,
        totalLikes: 34,
        liked: false
      },
      {
        id: 'nft_4',
        tokenId: '1004',
        name: 'VIP Access Pass',
        description: 'Exclusive access to premium platform features',
        image: '🎟️',
        creator: 'PlatformTeam',
        owner: 'vipuser',
        price: 0.01,
        currency: 'BTC',
        isForSale: true,
        isAuction: false,
        category: 'utility',
        rarity: 'rare',
        traits: [
          { trait_type: 'Access Level', value: 'VIP' },
          { trait_type: 'Duration', value: '1 Year' },
          { trait_type: 'Benefits', value: 'Premium' }
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        royalty: 0,
        totalViews: 789,
        totalLikes: 45,
        liked: false
      }
    ];
    setNfts(mockNFTs);
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: '🌐' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'utility', name: 'Utility', icon: '🔧' },
    { id: 'collectible', name: 'Collectible', icon: '💎' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400/30';
      case 'rare': return 'border-blue-400/30';
      case 'epic': return 'border-purple-400/30';
      case 'legendary': return 'border-yellow-400/30';
      default: return 'border-white/10';
    }
  };

  const handleLikeNFT = (nftId: string) => {
    setNfts(nfts.map(nft => 
      nft.id === nftId 
        ? { ...nft, liked: !nft.liked, totalLikes: nft.liked ? nft.totalLikes - 1 : nft.totalLikes + 1 }
        : nft
    ));
  };

  const handleBuyNFT = async (nft: NFTData) => {
    if (!user || !gameWallet || !nft.price) return;

    if (gameWallet.balances[nft.currency] < nft.price) {
      alert(`Insufficient ${nft.currency} balance`);
      return;
    }

    // Simulate purchase
    updateGameBalance(nft.currency, -nft.price);
    setNfts(nfts.map(n => n.id === nft.id ? { ...n, owner: user.id, isForSale: false } : n));
    alert(`Successfully purchased ${nft.name} for ${nft.price} ${nft.currency}!`);
  };

  const filteredNFTs = nfts
    .filter(nft => selectedCategory === 'all' || nft.category === selectedCategory)
    .filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_low': return (a.price || 0) - (b.price || 0);
        case 'price_high': return (b.price || 0) - (a.price || 0);
        case 'popular': return b.totalViews - a.totalViews;
        default: return 0;
      }
    });

  const renderNFTCard = (nft: NFTData) => (
    <motion.div
      key={nft.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={`glass rounded-xl overflow-hidden border-2 ${getRarityBorder(nft.rarity)} hover:border-crypto-400/50 transition-all duration-300`}
    >
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-crypto-500/20 to-purple-600/20 flex items-center justify-center text-6xl">
          {nft.image}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLikeNFT(nft.id)}
            className={`p-2 glass rounded-full ${nft.liked ? 'text-red-400' : 'text-white/70'}`}
          >
            <Heart className={`w-4 h-4 ${nft.liked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold glass ${getRarityColor(nft.rarity)}`}>
            {nft.rarity.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-white truncate">{nft.name}</h3>
          {nft.isAuction && <Gavel className="w-4 h-4 text-yellow-400" />}
        </div>
        
        <p className="text-sm text-white/70 mb-3 line-clamp-2">{nft.description}</p>
        
        <div className="flex items-center justify-between text-xs text-white/50 mb-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {nft.totalViews}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {nft.totalLikes}
          </span>
        </div>
        
        {nft.isForSale && nft.price && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">Price</p>
              <p className="font-bold text-crypto-400">
                {nft.price} {nft.currency}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBuyNFT(nft)}
              className="px-4 py-2 bg-gradient-to-r from-crypto-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-crypto-600 hover:to-purple-700"
            >
              {nft.isAuction ? 'Bid' : 'Buy'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderExplore = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-white/20 text-white placeholder-white/50 bg-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass rounded-lg px-3 py-2 text-white bg-transparent border border-white/20"
          >
            <option value="newest" className="bg-gray-800">Newest</option>
            <option value="oldest" className="bg-gray-800">Oldest</option>
            <option value="price_low" className="bg-gray-800">Price: Low to High</option>
            <option value="price_high" className="bg-gray-800">Price: High to Low</option>
            <option value="popular" className="bg-gray-800">Most Popular</option>
          </select>
          
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-crypto-500 text-white' : 'text-white/70'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-crypto-500 text-white' : 'text-white/70'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'border-crypto-400 bg-crypto-500/20 text-white'
                : 'border-white/20 hover:border-crypto-400/50 text-white/70'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-semibold">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* NFT Grid */}
      <AnimatePresence>
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredNFTs.map(renderNFTCard)}
        </div>
      </AnimatePresence>
      
      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 text-lg">No NFTs found matching your criteria</p>
          <p className="text-white/50">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6">
      <GlassContainer className="p-8">
        <div className="text-center mb-8">
          <Upload className="w-16 h-16 text-crypto-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Create Your NFT</h2>
          <p className="text-white/70">Mint your digital assets on the blockchain</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">NFT Name</label>
              <input
                type="text"
                placeholder="Enter NFT name"
                className="w-full glass rounded-lg px-4 py-3 text-white bg-transparent border border-white/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Description</label>
              <textarea
                placeholder="Describe your NFT"
                rows={4}
                className="w-full glass rounded-lg px-4 py-3 text-white bg-transparent border border-white/20 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Category</label>
              <select className="w-full glass rounded-lg px-4 py-3 text-white bg-transparent border border-white/20">
                <option value="art" className="bg-gray-800">Art</option>
                <option value="gaming" className="bg-gray-800">Gaming</option>
                <option value="music" className="bg-gray-800">Music</option>
                <option value="utility" className="bg-gray-800">Utility</option>
                <option value="collectible" className="bg-gray-800">Collectible</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Royalty (%)</label>
              <input
                type="number"
                placeholder="0-20"
                min="0"
                max="20"
                className="w-full glass rounded-lg px-4 py-3 text-white bg-transparent border border-white/20"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Upload File</label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-crypto-400/50 transition-colors">
                <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 mb-2">Drag & drop or click to upload</p>
                <p className="text-white/50 text-sm">PNG, JPG, GIF, MP4 (Max 100MB)</p>
                <button className="mt-4 glass-button px-6 py-2 text-crypto-400 hover:text-white">
                  Choose File
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Blockchain</label>
              <select className="w-full glass rounded-lg px-4 py-3 text-white bg-transparent border border-white/20">
                <option value="ethereum" className="bg-gray-800">Ethereum</option>
                <option value="polygon" className="bg-gray-800">Polygon</option>
                <option value="binance" className="bg-gray-800">Binance Smart Chain</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-crypto-500 to-purple-600 text-white rounded-xl font-semibold hover:from-crypto-600 hover:to-purple-700"
          >
            Mint NFT (0.001 ETH)
          </motion.button>
          <p className="text-white/50 text-sm mt-2">Gas fees apply for minting on blockchain</p>
        </div>
      </GlassContainer>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
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
                🎨 <span className="bg-gradient-to-r from-crypto-400 to-purple-500 bg-clip-text text-transparent">
                  NFT Marketplace
                </span>
              </h1>
              <p className="text-white/70">Discover, collect, and trade unique digital assets</p>
            </div>
          </div>
          
          {gameWallet && (
            <div className="text-right">
              <p className="text-sm text-white/70">Wallet Balance</p>
              <p className="text-lg font-bold text-crypto-400">
                {gameWallet.balances.ETH.toFixed(4)} ETH
              </p>
            </div>
          )}
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
              { id: 'explore', label: 'Explore', icon: Search },
              { id: 'collections', label: 'Collections', icon: Star },
              { id: 'create', label: 'Create', icon: Plus },
              { id: 'my-nfts', label: 'My NFTs', icon: Palette },
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
          {activeTab === 'explore' && renderExplore()}
          {activeTab === 'create' && renderCreate()}
          {(activeTab === 'collections' || activeTab === 'my-nfts') && (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg">Coming Soon!</p>
              <p className="text-white/50">This feature is under development</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NFTMarketplace;