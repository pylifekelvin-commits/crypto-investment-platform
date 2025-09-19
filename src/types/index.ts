export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
  change24hPercent: number;
  icon?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  assets: CryptoAsset[];
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  fee: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface CryptoPriceData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image: string;
  last_updated: string;
}

export interface TradeOrder {
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price?: number;
  orderType: 'market' | 'limit';
}

export interface UserPreferences {
  videoQuality: 'auto' | 'high' | 'medium' | 'low';
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  glassOpacity: number;
  autoPlayVideo: boolean;
  videoVolume: number;
  theme: 'dark' | 'light';
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'news';
  author: string;
  publishedAt: string;
  readTime: number;
  image?: string;
}

export interface MarketTrend {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  icon: string;
}

export interface VideoSource {
  src: string;
  quality: 'high' | 'medium' | 'low';
  type: string;
  description: string;
  thumbnail?: string;
}

export interface VestingPlan {
  id: string;
  name: string;
  description: string;
  minInvestment: number;
  maxInvestment: number;
  duration: number; // in days
  apy: number; // annual percentage yield
  compoundingFrequency: 'daily' | 'weekly' | 'monthly';
  earlyWithdrawalPenalty: number;
  supportedAssets: string[];
  riskLevel: 'low' | 'medium' | 'high';
  icon: string;
  color: string;
}

export interface VestingPosition {
  id: string;
  userId: string;
  planId: string;
  asset: string;
  amount: number;
  initialValue: number;
  currentValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'early_withdrawal';
  earnedRewards: number;
  lastRewardDate: string;
  autoReinvest: boolean;
}

export interface StakingPool {
  id: string;
  name: string;
  asset: string;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockPeriod: number; // in days
  rewardFrequency: 'daily' | 'weekly';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  icon: string;
}

export interface StakingPosition {
  id: string;
  userId: string;
  poolId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'unstaking';
  earnedRewards: number;
  lastRewardDate: string;
  autoCompound: boolean;
}

export interface InvestmentAnalytics {
  totalVested: number;
  totalStaked: number;
  totalRewards: number;
  portfolioGrowth: number;
  riskScore: number;
  diversificationScore: number;
  performanceHistory: PerformanceData[];
}

export interface PerformanceData {
  date: string;
  portfolioValue: number;
  vestingValue: number;
  stakingValue: number;
  totalRewards: number;
}

export interface EarnTask {
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

export interface UserEarnings {
  totalEarned: number;
  availableBalance: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakRewards: {
    day: number;
    currency: 'BTC' | 'ETH' | 'VEST';
    amount: number;
    claimed: boolean;
  }[];
  achievements: Achievement[];
  badges: ('vip' | 'whale' | 'winner' | 'streaker' | 'explorer')[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  lastCheckIn: string;
  checkInReward: {
    currency: 'BTC' | 'ETH' | 'VEST';
    amount: number;
  };
}

// Gaming System Types
export interface GameWallet {
  id: string;
  userId: string;
  balances: {
    BTC: number;
    ETH: number;
    VEST: number;
  };
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  lastActivity: string;
  transactions: GameTransaction[];
}

export interface GameTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'loss' | 'transfer';
  amount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  description: string;
  txHash?: string;
  gameType?: GameType;
  gameId?: string;
  fee?: number;
  fromAddress?: string;
  toAddress?: string;
}

export interface GameBet {
  id: string;
  userId: string;
  gameType: GameType;
  gameId: string;
  betAmount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  payout?: number;
  placedAt: string;
  settledAt?: string;
  details: any; // Game-specific details
}

export type GameType = 'lottery' | 'sports' | 'casino' | 'prediction';

// Lottery System
export interface LotteryDraw {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'special';
  prizePool: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  drawDate: string;
  status: 'active' | 'closed' | 'drawn';
  winningNumbers?: number[];
  winners?: LotteryWinner[];
}

export interface LotteryTicket {
  id: string;
  userId: string;
  drawId: string;
  numbers: number[];
  quantity: number;
  totalCost: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  purchaseDate: string;
  drawDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  isWinner: boolean;
  prizeAmount?: number;
}

export interface LotteryWinner {
  userId: string;
  userName: string;
  ticketId: string;
  prizeAmount: number;
  rank: number;
}

// Sports Betting
export interface SportsMatch {
  id: string;
  sport: 'football' | 'basketball' | 'tennis' | 'soccer' | 'cricket';
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished' | 'cancelled';
  score?: {
    home: number;
    away: number;
  };
  odds: {
    homeWin: number;
    awayWin: number;
    draw?: number;
  };
  totalBets: number;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface SportsBet {
  id: string;
  userId: string;
  matchId: string;
  betType: 'home_win' | 'away_win' | 'draw';
  amount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  odds: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  placedAt: string;
}

// Casino Games
export interface CasinoGame {
  id: string;
  name: string;
  type: 'slots' | 'roulette' | 'dice' | 'spin_bottle' | 'blackjack';
  description: string;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  isActive: boolean;
  icon: string;
  popularity: number;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  gameType: string;
  startTime: string;
  endTime?: string;
  totalWagered: number;
  totalWon: number;
  netResult: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  rounds: GameRound[];
  status: 'active' | 'completed';
}

export interface GameRound {
  id: string;
  roundNumber: number;
  betAmount: number;
  result: any; // Game-specific result
  payout: number;
  timestamp: string;
}

// Spin the Bottle Game
export interface SpinBottleGame {
  id: string;
  players: SpinBottlePlayer[];
  currentPlayerIndex: number;
  isSpinning: boolean;
  lastResult?: {
    selectedPlayer: string;
    action: string;
    timestamp: string;
  };
  pot: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  status: 'waiting' | 'active' | 'finished';
}

export interface SpinBottlePlayer {
  userId: string;
  userName: string;
  avatar?: string;
  betAmount: number;
  isActive: boolean;
}

// Dice Game
export interface DiceGame {
  id: string;
  betAmount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  predictedNumber: number;
  rolledNumber?: number;
  multiplier: number;
  payout?: number;
  isWin?: boolean;
  timestamp: string;
}

// Prediction Games
export interface PredictionMarket {
  id: string;
  title: string;
  description: string;
  category: 'crypto' | 'sports' | 'politics' | 'weather';
  options: PredictionOption[];
  endDate: string;
  resolveDate: string;
  totalPool: number;
  status: 'active' | 'closed' | 'resolved';
  winningOption?: string;
}

export interface PredictionOption {
  id: string;
  text: string;
  odds: number;
  totalBets: number;
  backers: number;
}

export interface PredictionBet {
  id: string;
  userId: string;
  marketId: string;
  optionId: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  odds: number;
  potentialPayout: number;
  status: 'active' | 'won' | 'lost';
  placedAt: string;
}

// Gaming Statistics
export interface GamingStats {
  userId: string;
  totalGamesPlayed: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
  netProfit: number;
  winRate: number;
  favoriteGame: string;
  biggestWin: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  change: number; // position change
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  level: number;
  xp: number;
  totalEarned: {
    BTC: number;
    ETH: number;
    VEST: number;
  };
  streak: number;
  achievements: number;
  gamesPlayed: number;
  winRate: number;
  totalWagered: number;
  netProfit: number;
  joinedDate: string;
  lastActive: string;
  badges: ('vip' | 'whale' | 'winner' | 'streaker' | 'explorer')[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export interface UserLevel {
  level: number;
  xp: number;
  xpRequired: number;
  title: string;
  rewards: {
    currency: 'BTC' | 'ETH' | 'VEST';
    amount: number;
  }[];
  perks: string[];
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string;
  streakRewards: {
    day: number;
    currency: 'BTC' | 'ETH' | 'VEST';
    amount: number;
    claimed: boolean;
  }[];
}

// NFT Marketplace Types
export interface NFT {
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
  traits: NFTTrait[];
  createdAt: string;
  royalty: number; // percentage
  totalViews: number;
  totalLikes: number;
  blockchain: 'ethereum' | 'polygon' | 'binance';
}

export interface NFTTrait {
  trait_type: string;
  value: string;
  rarity?: number;
}

export interface NFTAuction {
  id: string;
  nftId: string;
  startingPrice: number;
  currentBid: number;
  currency: 'BTC' | 'ETH' | 'VEST';
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  bidders: AuctionBid[];
  reservePrice?: number;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidder: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  creator: string;
  coverImage: string;
  floorPrice: number;
  totalItems: number;
  owners: number;
  totalVolume: number;
  verified: boolean;
}

export interface NFTActivity {
  id: string;
  nftId: string;
  type: 'mint' | 'sale' | 'transfer' | 'bid' | 'listing';
  from?: string;
  to: string;
  price?: number;
  currency?: 'BTC' | 'ETH' | 'VEST';
  timestamp: string;
  txHash: string;
}

export interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Portfolio
  portfolio: Portfolio | null;
  
  // Vesting & Staking
  vestingPlans: VestingPlan[];
  vestingPositions: VestingPosition[];
  stakingPools: StakingPool[];
  stakingPositions: StakingPosition[];
  investmentAnalytics: InvestmentAnalytics | null;
  
  // Gaming System
  gameWallet: GameWallet | null;
  activeBets: GameBet[];
  lotteryDraws: LotteryDraw[];
  userTickets: LotteryTicket[];
  sportsMatches: SportsMatch[];
  casinoGames: CasinoGame[];
  activeSessions: GameSession[];
  predictionMarkets: PredictionMarket[];
  gamingStats: GamingStats | null;
  leaderboard: LeaderboardEntry[];
  
  // NFT Marketplace
  nfts: NFT[];
  userNFTs: NFT[];
  collections: NFTCollection[];
  activeAuctions: NFTAuction[];
  nftActivities: NFTActivity[];
  
  // Market data
  cryptoPrices: Record<string, CryptoPriceData>;
  marketTrends: MarketTrend[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Video background
  videoSrc: string;
  videoQuality: string;
  isVideoPlaying: boolean;
  videoVolume: number;
  showVideoControls: boolean;
  
  // User preferences
  preferences: UserPreferences;
  
  // Trading
  activeOrders: TradeOrder[];
  transactions: Transaction[];
}