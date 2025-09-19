import { create } from 'zustand';
import { 
  AppState, 
  User, 
  Portfolio, 
  CryptoPriceData, 
  UserPreferences,
  VestingPlan,
  VestingPosition,
  StakingPool,
  StakingPosition,
  InvestmentAnalytics,
  GameWallet,
  GameBet,
  LotteryDraw,
  LotteryTicket,
  SportsMatch,
  CasinoGame,
  GameSession,
  PredictionMarket,
  GamingStats,
  LeaderboardEntry,
  SportsBet,
  PredictionBet,
  GameTransaction,
} from '../types';

interface AppStore extends AppState {
  // Auth actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // Portfolio actions
  setPortfolio: (portfolio: Portfolio) => void;
  updatePortfolioValue: (newValue: number) => void;
  
  // Vesting actions
  setVestingPlans: (plans: VestingPlan[]) => void;
  addVestingPosition: (position: VestingPosition) => void;
  updateVestingPosition: (id: string, updates: Partial<VestingPosition>) => void;
  
  // Staking actions
  setStakingPools: (pools: StakingPool[]) => void;
  addStakingPosition: (position: StakingPosition) => void;
  updateStakingPosition: (id: string, updates: Partial<StakingPosition>) => void;
  
  // Analytics actions
  setInvestmentAnalytics: (analytics: InvestmentAnalytics) => void;
  
  // Gaming actions
  setGameWallet: (wallet: GameWallet) => void;
  updateGameBalance: (currency: 'BTC' | 'ETH' | 'VEST', amount: number) => void;
  addGameTransaction: (transaction: GameTransaction) => void;
  placeBet: (bet: GameBet) => void;
  updateBet: (betId: string, updates: Partial<GameBet>) => void;
  setLotteryDraws: (draws: LotteryDraw[]) => void;
  purchaseLotteryTicket: (ticket: LotteryTicket) => void;
  setSportsMatches: (matches: SportsMatch[]) => void;
  placeSportsBet: (bet: SportsBet) => void;
  setCasinoGames: (games: CasinoGame[]) => void;
  startGameSession: (session: GameSession) => void;
  endGameSession: (sessionId: string, result: Partial<GameSession>) => void;
  setPredictionMarkets: (markets: PredictionMarket[]) => void;
  placePredictionBet: (bet: PredictionBet) => void;
  setGamingStats: (stats: GamingStats) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  
  // Market data actions
  updateCryptoPrices: (prices: Record<string, CryptoPriceData>) => void;
  updateSinglePrice: (symbol: string, price: CryptoPriceData) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Video actions
  setVideoSrc: (src: string) => void;
  setVideoQuality: (quality: string) => void;
  toggleVideo: () => void;
  setVideoVolume: (volume: number) => void;
  toggleVideoControls: () => void;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  videoQuality: 'auto',
  enableAnimations: true,
  animationSpeed: 'normal',
  glassOpacity: 0.15,
  autoPlayVideo: true,
  videoVolume: 0.3,
  theme: 'dark',
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  portfolio: null,
  vestingPlans: [],
  vestingPositions: [],
  stakingPools: [],
  stakingPositions: [],
  investmentAnalytics: null,
  
  // Gaming state
  gameWallet: null,
  activeBets: [],
  lotteryDraws: [],
  userTickets: [],
  sportsMatches: [],
  casinoGames: [],
  activeSessions: [],
  predictionMarkets: [],
  gamingStats: null,
  leaderboard: [],
  
  cryptoPrices: {},
  marketTrends: [],
  isLoading: false,
  error: null,
  videoSrc: 'https://videos.pexels.com/video-files/3141354/3141354-uhd_2560_1440_30fps.mp4',
  videoQuality: 'auto',
  isVideoPlaying: true,
  videoVolume: 0.3,
  showVideoControls: false,
  preferences: defaultPreferences,
  activeOrders: [],
  transactions: [],

  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: (user) => set({ 
    user, 
    isAuthenticated: true,
    error: null 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    portfolio: null,
    vestingPositions: [],
    stakingPositions: [],
    investmentAnalytics: null,
    gameWallet: null,
    activeBets: [],
    userTickets: [],
    activeSessions: [],
    gamingStats: null,
    activeOrders: [],
    transactions: []
  }),

  // Portfolio actions
  setPortfolio: (portfolio) => set({ portfolio }),
  
  updatePortfolioValue: (newValue) => set((state) => ({
    portfolio: state.portfolio ? {
      ...state.portfolio,
      totalValue: newValue
    } : null
  })),

  // Vesting actions
  setVestingPlans: (vestingPlans) => set({ vestingPlans }),
  
  addVestingPosition: (position) => set((state) => ({
    vestingPositions: [...state.vestingPositions, position]
  })),
  
  updateVestingPosition: (id, updates) => set((state) => ({
    vestingPositions: state.vestingPositions.map(pos => 
      pos.id === id ? { ...pos, ...updates } : pos
    )
  })),

  // Staking actions
  setStakingPools: (stakingPools) => set({ stakingPools }),
  
  addStakingPosition: (position) => set((state) => ({
    stakingPositions: [...state.stakingPositions, position]
  })),
  
  updateStakingPosition: (id, updates) => set((state) => ({
    stakingPositions: state.stakingPositions.map(pos => 
      pos.id === id ? { ...pos, ...updates } : pos
    )
  })),

  // Analytics actions
  setInvestmentAnalytics: (investmentAnalytics) => set({ investmentAnalytics }),

  // Market data actions
  updateCryptoPrices: (prices) => set({ cryptoPrices: prices }),
  
  updateSinglePrice: (symbol, price) => set((state) => ({
    cryptoPrices: {
      ...state.cryptoPrices,
      [symbol]: price
    }
  })),

  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Video actions
  setVideoSrc: (src) => set({ videoSrc: src }),
  setVideoQuality: (quality) => set({ videoQuality: quality }),
  toggleVideo: () => set((state) => ({ isVideoPlaying: !state.isVideoPlaying })),
  setVideoVolume: (volume) => set({ videoVolume: volume }),
  toggleVideoControls: () => set((state) => ({ showVideoControls: !state.showVideoControls })),

  // Preferences actions
  updatePreferences: (newPreferences) => set((state) => ({
    preferences: { ...state.preferences, ...newPreferences }
  })),

  // Gaming actions
  setGameWallet: (gameWallet) => set({ gameWallet }),
  
  updateGameBalance: (currency, amount) => set((state) => ({
    gameWallet: state.gameWallet ? {
      ...state.gameWallet,
      balances: {
        ...state.gameWallet.balances,
        [currency]: state.gameWallet.balances[currency] + amount
      },
      totalWagered: amount < 0 ? state.gameWallet.totalWagered + Math.abs(amount) : state.gameWallet.totalWagered,
      totalWon: amount > 0 ? state.gameWallet.totalWon + amount : state.gameWallet.totalWon,
      totalLost: amount < 0 ? state.gameWallet.totalLost + Math.abs(amount) : state.gameWallet.totalLost,
      lastActivity: new Date().toISOString()
    } : null
  })),
  
  addGameTransaction: (transaction) => set((state) => ({
    gameWallet: state.gameWallet ? {
      ...state.gameWallet,
      transactions: [transaction, ...(state.gameWallet.transactions || [])]
    } : null
  })),
  
  placeBet: (bet) => set((state) => ({
    activeBets: [...state.activeBets, bet]
  })),
  
  updateBet: (betId, updates) => set((state) => ({
    activeBets: state.activeBets.map(bet => 
      bet.id === betId ? { ...bet, ...updates } : bet
    )
  })),
  
  setLotteryDraws: (lotteryDraws) => set({ lotteryDraws }),
  
  purchaseLotteryTicket: (ticket) => set((state) => ({
    userTickets: [...state.userTickets, ticket]
  })),
  
  setSportsMatches: (sportsMatches) => set({ sportsMatches }),
  
  placeSportsBet: (bet) => set((state) => {
    const gameBet: GameBet = {
      id: bet.id,
      userId: bet.userId,
      gameType: 'sports',
      gameId: bet.matchId,
      betAmount: bet.amount,
      currency: bet.currency,
      odds: bet.odds,
      status: 'pending',
      placedAt: bet.placedAt,
      details: bet
    };
    return {
      activeBets: [...state.activeBets, gameBet]
    };
  }),
  
  setCasinoGames: (casinoGames) => set({ casinoGames }),
  
  startGameSession: (session) => set((state) => ({
    activeSessions: [...state.activeSessions, session]
  })),
  
  endGameSession: (sessionId, result) => set((state) => ({
    activeSessions: state.activeSessions.map(session => 
      session.id === sessionId ? { ...session, ...result, status: 'completed' as const } : session
    )
  })),
  
  setPredictionMarkets: (predictionMarkets) => set({ predictionMarkets }),
  
  placePredictionBet: (bet) => set((state) => {
    const gameBet: GameBet = {
      id: bet.id,
      userId: bet.userId,
      gameType: 'prediction',
      gameId: bet.marketId,
      betAmount: bet.amount,
      currency: bet.currency,
      odds: bet.odds,
      status: 'pending',
      placedAt: bet.placedAt,
      details: bet
    };
    return {
      activeBets: [...state.activeBets, gameBet]
    };
  }),
  
  setGamingStats: (gamingStats) => set({ gamingStats }),
  
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}));