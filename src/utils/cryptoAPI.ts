import axios from 'axios';
import { CryptoPriceData } from '../types';

class CryptoAPI {
  private baseURL = 'https://api.coingecko.com/api/v3';
  private wsConnection: WebSocket | null = null;
  private priceCallbacks: ((prices: Record<string, CryptoPriceData>) => void)[] = [];

  // Get current prices for multiple cryptocurrencies
  async getCurrentPrices(symbols: string[] = ['bitcoin', 'ethereum', 'binancecoin', 'cardano']): Promise<Record<string, CryptoPriceData>> {
    try {
      const response = await axios.get(`${this.baseURL}/simple/price`, {
        params: {
          ids: symbols.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
          include_last_updated_at: true
        }
      });

      const priceData: Record<string, CryptoPriceData> = {};
      
      for (const [id, data] of Object.entries(response.data)) {
        const cryptoData = data as any;
        priceData[this.getSymbolFromId(id)] = {
          symbol: this.getSymbolFromId(id),
          name: this.getNameFromId(id),
          current_price: cryptoData.usd,
          price_change_24h: cryptoData.usd_24h_change || 0,
          price_change_percentage_24h: cryptoData.usd_24h_change || 0,
          market_cap: cryptoData.usd_market_cap || 0,
          volume_24h: cryptoData.usd_24h_vol || 0,
          image: this.getIconFromId(id),
          last_updated: new Date().toISOString()
        };
      }
      
      return priceData;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Return mock data as fallback
      return this.getMockPrices();
    }
  }

  // Get detailed market data
  async getMarketData(limit: number = 10): Promise<CryptoPriceData[]> {
    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });

      return response.data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        image: coin.image,
        last_updated: coin.last_updated
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockMarketData();
    }
  }

  // Subscribe to real-time price updates (simulated with polling)
  subscribeToPriceUpdates(callback: (prices: Record<string, CryptoPriceData>) => void) {
    this.priceCallbacks.push(callback);
    
    // Start polling for price updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const prices = await this.getCurrentPrices();
        this.priceCallbacks.forEach(cb => cb(prices));
      } catch (error) {
        console.error('Error in price update:', error);
      }
    }, 30000);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      this.priceCallbacks = this.priceCallbacks.filter(cb => cb !== callback);
    };
  }

  // Mock data for development/fallback
  private getMockPrices(): Record<string, CryptoPriceData> {
    return {
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 45000 + (Math.random() - 0.5) * 2000,
        price_change_24h: 1200 + (Math.random() - 0.5) * 400,
        price_change_percentage_24h: 2.74 + (Math.random() - 0.5) * 2,
        market_cap: 880000000000,
        volume_24h: 28500000000,
        image: '₿',
        last_updated: new Date().toISOString()
      },
      ETH: {
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2250 + (Math.random() - 0.5) * 200,
        price_change_24h: 50 + (Math.random() - 0.5) * 100,
        price_change_percentage_24h: 2.27 + (Math.random() - 0.5) * 3,
        market_cap: 270000000000,
        volume_24h: 12300000000,
        image: 'Ξ',
        last_updated: new Date().toISOString()
      },
      BNB: {
        symbol: 'BNB',
        name: 'Binance Coin',
        current_price: 285 + (Math.random() - 0.5) * 30,
        price_change_24h: -5.2 + (Math.random() - 0.5) * 10,
        price_change_percentage_24h: -1.79 + (Math.random() - 0.5) * 2,
        market_cap: 42000000000,
        volume_24h: 1800000000,
        image: '◊',
        last_updated: new Date().toISOString()
      },
      ADA: {
        symbol: 'ADA',
        name: 'Cardano',
        current_price: 0.42 + (Math.random() - 0.5) * 0.1,
        price_change_24h: 0.015 + (Math.random() - 0.5) * 0.03,
        price_change_percentage_24h: 3.7 + (Math.random() - 0.5) * 4,
        market_cap: 15000000000,
        volume_24h: 890000000,
        image: '⟐',
        last_updated: new Date().toISOString()
      }
    };
  }

  private getMockMarketData(): CryptoPriceData[] {
    const mockData = this.getMockPrices();
    return Object.values(mockData);
  }

  private getSymbolFromId(id: string): string {
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'binancecoin': 'BNB',
      'cardano': 'ADA',
      'solana': 'SOL',
      'ripple': 'XRP',
      'polkadot': 'DOT',
      'dogecoin': 'DOGE'
    };
    return symbolMap[id] || id.toUpperCase();
  }

  private getNameFromId(id: string): string {
    const nameMap: Record<string, string> = {
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'binancecoin': 'Binance Coin',
      'cardano': 'Cardano',
      'solana': 'Solana',
      'ripple': 'XRP',
      'polkadot': 'Polkadot',
      'dogecoin': 'Dogecoin'
    };
    return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
  }

  private getIconFromId(id: string): string {
    const iconMap: Record<string, string> = {
      'bitcoin': '₿',
      'ethereum': 'Ξ',
      'binancecoin': '◊',
      'cardano': '⟐',
      'solana': '◎',
      'ripple': '✕',
      'polkadot': '●',
      'dogecoin': 'Ð'
    };
    return iconMap[id] || '◊';
  }
}

// Export singleton instance
export const cryptoAPI = new CryptoAPI();