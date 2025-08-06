/**
 * Analytics Test Data Generator
 * Extends the existing TransactionDataGenerator to create analytics-specific test data
 * with proper time periods, network performance data, and cost comparison metrics
 */

const TransactionDataGenerator = require('./TransactionDataGenerator');

class AnalyticsTestDataGenerator extends TransactionDataGenerator {
  constructor() {
    super();
    
    // Analytics-specific networks
    this.networks = ['polygon', 'ethereum', 'arbitrum', 'base', 'optimism'];
    
    // Analytics time periods
    this.periods = ['7d', '30d', '90d', '1y'];
    
    // Transfer types for analytics
    this.analyticsTransferTypes = [
      'interbank',
      'international', 
      'domestic',
      'cross_border',
      'liquidity_rebalancing',
      'merchant_settlement',
      'remittance',
      'trade_finance'
    ];
  }

  /**
   * Generate analytics-specific transaction data with proper time distribution
   */
  async generateAnalyticsTransactions(banks, wallets, users, options = {}) {
    const {
      period = '30d',
      bankId = null,
      networkDistribution = { polygon: 0.4, ethereum: 0.3, arbitrum: 0.2, base: 0.1 },
      transferTypeDistribution = { interbank: 0.3, international: 0.25, domestic: 0.2, cross_border: 0.15, remittance: 0.1 }
    } = options;

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = this.getStartDateForPeriod(period);
    
    // Generate base transactions
    const baseTransactions = await this.generateTransactions(banks, wallets, users, 500);
    
    // Transform transactions for analytics
    const analyticsTransactions = baseTransactions
      .filter(tx => {
        // Filter by date range
        const txDate = new Date(tx.created_at);
        return txDate >= startDate && txDate <= endDate;
      })
      .filter(tx => {
        // Filter by bank if specified
        if (bankId) {
          const sourceWallet = wallets.find(w => w.id === tx.source_wallet_id);
          return sourceWallet && sourceWallet.bank_id === bankId;
        }
        return true;
      })
      .map(tx => this.transformTransactionForAnalytics(tx, networkDistribution, transferTypeDistribution));

    return analyticsTransactions;
  }

  /**
   * Transform regular transaction to analytics format
   */
  transformTransactionForAnalytics(transaction, networkDistribution, transferTypeDistribution) {
    // Select network based on distribution
    const network = this.selectNetwork(networkDistribution);
    
    // Select transfer type based on distribution
    const transferType = this.selectTransferType(transferTypeDistribution);
    
    // Calculate analytics-specific metrics
    const swiftEquivalentFee = this.calculateSwiftFee(transaction.amount, transaction.transaction_type);
    const nexoraFee = this.calculateNexoraFee(transaction.amount, network, transferType);
    const settlementTimeSeconds = this.calculateSettlementTime(transaction.processing_time_minutes, network);
    
    return {
      // Original transaction data
      id: transaction.id || this.generateId(),
      source_wallet_id: transaction.source_wallet_id,
      destination_wallet_id: transaction.destination_wallet_id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      
      // Analytics-specific data
      network_used: network,
      transfer_type: transferType,
      settlement_time_seconds: settlementTimeSeconds,
      
      // Cost comparison data
      swift_equivalent_fee: swiftEquivalentFee,
      nexora_fee: nexoraFee,
      fee_savings: swiftEquivalentFee - nexoraFee,
      savings_percentage: ((swiftEquivalentFee - nexoraFee) / swiftEquivalentFee * 100).toFixed(2),
      
      // Geographic and compliance data
      source_country: transaction.source_country,
      destination_country: transaction.destination_country,
      is_regional: transaction.is_regional,
      compliance_score: transaction.compliance_score,
      risk_level: transaction.risk_level,
      
      // Performance metrics
      success_rate: this.calculateSuccessRate(network, transferType),
      processing_efficiency: this.calculateProcessingEfficiency(settlementTimeSeconds, network),
      
      // Additional analytics fields
      volume_category: this.categorizeVolume(transaction.amount),
      frequency_category: this.categorizeFrequency(transaction.created_at),
      complexity_score: this.calculateComplexityScore(transaction, network, transferType)
    };
  }

  /**
   * Generate daily analytics data for a specific period
   */
  async generateDailyAnalytics(bankId, period = '30d') {
    const startDate = this.getStartDateForPeriod(period);
    const endDate = new Date();
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const dailyData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate realistic daily metrics
      const dailyMetrics = this.generateDailyMetrics(date, bankId);
      dailyData.push(dailyMetrics);
    }
    
    return dailyData;
  }

  /**
   * Generate daily metrics for a specific date
   */
  generateDailyMetrics(date, bankId) {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = this.isHoliday(date);
    const volumeMultiplier = isWeekend ? 0.3 : (isHoliday ? 0.5 : 1.0);
    
    const baseVolume = Math.random() * 1000000 + 500000; // $500K - $1.5M
    const baseTransactions = Math.floor(Math.random() * 50) + 20; // 20-70 transactions
    
    return {
      date: date.toISOString().split('T')[0],
      bank_id: bankId,
      total_transfers: Math.floor(baseTransactions * volumeMultiplier),
      total_volume: Math.floor(baseVolume * volumeMultiplier),
      total_fees: Math.floor(baseVolume * volumeMultiplier * 0.001), // 0.1% fee
      avg_settlement_time: Math.random() * 60 + 30, // 30-90 seconds
      success_rate: Math.random() * 5 + 95, // 95-100%
      cost_savings: Math.floor(baseVolume * volumeMultiplier * 0.02), // 2% savings
      estimated_swift_fees: Math.floor(baseVolume * volumeMultiplier * 0.005), // 0.5% SWIFT fee
      network_distribution: this.generateNetworkDistribution(),
      transfer_type_distribution: this.generateTransferTypeDistribution()
    };
  }

  /**
   * Generate network performance data
   */
  generateNetworkPerformanceData(bankId, period = '30d') {
    const networks = ['polygon', 'ethereum', 'arbitrum', 'base', 'optimism'];
    
    return networks.map(network => ({
      network,
      bank_id: bankId,
      total_transfers: Math.floor(Math.random() * 200) + 50,
      total_volume: Math.floor(Math.random() * 5000000) + 1000000,
      total_fees: Math.floor(Math.random() * 5000) + 1000,
      avg_settlement_time: Math.random() * 120 + 30, // 30-150 seconds
      success_rate: Math.random() * 8 + 92, // 92-100%
      cost_savings: Math.floor(Math.random() * 50000) + 10000,
      reliability_score: Math.random() * 10 + 90, // 90-100%
      throughput_tps: Math.random() * 1000 + 500, // 500-1500 TPS
      gas_efficiency: Math.random() * 20 + 80 // 80-100%
    }));
  }

  /**
   * Generate cost savings analysis data
   */
  generateCostSavingsData(bankId, period = '30d') {
    const totalVolume = Math.floor(Math.random() * 10000000) + 5000000; // $5M - $15M
    const totalTransfers = Math.floor(Math.random() * 500) + 200; // 200-700 transfers
    
    return {
      period,
      bank_id: bankId,
      nexora_costs: {
        total_fees: Math.floor(totalVolume * 0.001), // 0.1%
        avg_fee_per_transfer: Math.floor(totalVolume * 0.001 / totalTransfers),
        fee_breakdown: {
          network_fees: Math.floor(totalVolume * 0.0006), // 0.06%
          platform_fees: Math.floor(totalVolume * 0.0004) // 0.04%
        }
      },
      swift_costs: {
        total_fees: Math.floor(totalVolume * 0.005), // 0.5%
        avg_fee_per_transfer: Math.floor(totalVolume * 0.005 / totalTransfers),
        fee_breakdown: {
          wire_fees: Math.floor(totalVolume * 0.002), // 0.2%
          correspondent_fees: Math.floor(totalVolume * 0.0015), // 0.15%
          fx_margin: Math.floor(totalVolume * 0.0015) // 0.15%
        }
      },
      savings: {
        total_savings: Math.floor(totalVolume * 0.004), // 0.4%
        savings_percentage: 80.0,
        savings_per_transfer: Math.floor(totalVolume * 0.004 / totalTransfers)
      }
    };
  }

  /**
   * Generate KPI data for analytics dashboard
   */
  generateKPIData(bankId, period = '30d') {
    const totalVolume = Math.floor(Math.random() * 10000000) + 5000000;
    const totalTransfers = Math.floor(Math.random() * 500) + 200;
    const avgSettlementTime = Math.random() * 60 + 30;
    const successRate = Math.random() * 5 + 95;
    const costSavings = Math.floor(totalVolume * 0.02);
    const estimatedSwiftFees = Math.floor(totalVolume * 0.005);
    
    return {
      bank_id: bankId,
      period,
      total_transfers: totalTransfers,
      total_volume: totalVolume,
      total_fees: Math.floor(totalVolume * 0.001),
      avg_settlement_time: avgSettlementTime,
      success_rate: successRate,
      cost_savings: costSavings,
      estimated_swift_fees: estimatedSwiftFees,
      savings_percentage: ((costSavings / estimatedSwiftFees) * 100).toFixed(2),
      idle_capital_reduction: Math.floor(totalVolume * 0.15), // 15% reduction
      cost_reduction_vs_swift: 80.0
    };
  }

  /**
   * Generate volume trends data
   */
  generateVolumeTrendsData(bankId, period = '30d') {
    const startDate = this.getStartDateForPeriod(period);
    const endDate = new Date();
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const trends = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const volumeMultiplier = isWeekend ? 0.3 : 1.0;
      
      const baseVolume = Math.random() * 100000 + 50000; // $50K - $150K
      const baseTransfers = Math.floor(Math.random() * 10) + 5; // 5-15 transfers
      
      trends.push({
        date: date.toISOString().split('T')[0],
        transfers: Math.floor(baseTransfers * volumeMultiplier),
        volume: Math.floor(baseVolume * volumeMultiplier),
        fees: Math.floor(baseVolume * volumeMultiplier * 0.001),
        avg_settlement_time: Math.random() * 60 + 30,
        success_rate: Math.random() * 5 + 95
      });
    }
    
    return trends;
  }

  /**
   * Generate transfer type distribution data
   */
  generateTransferTypeDistributionData(bankId, period = '30d') {
    const transferTypes = [
      'interbank', 'international', 'domestic', 'cross_border',
      'liquidity_rebalancing', 'merchant_settlement', 'remittance', 'trade_finance'
    ];
    
    const totalTransfers = Math.floor(Math.random() * 500) + 200;
    let remainingTransfers = totalTransfers;
    
    return transferTypes.map((type, index) => {
      let count;
      if (index === transferTypes.length - 1) {
        count = remainingTransfers;
      } else {
        count = Math.floor(Math.random() * (remainingTransfers / (transferTypes.length - index))) + 1;
        remainingTransfers -= count;
      }
      
      const percentage = ((count / totalTransfers) * 100).toFixed(2);
      const avgVolume = Math.random() * 50000 + 10000; // $10K - $60K
      
      return {
        transfer_type: type,
        count,
        total_volume: count * avgVolume,
        total_fees: count * avgVolume * 0.001,
        avg_settlement_time: Math.random() * 60 + 30,
        percentage
      };
    });
  }

  /**
   * Generate comprehensive analytics dashboard data
   */
  async generateAnalyticsDashboardData(bankId, period = '30d') {
    const kpis = this.generateKPIData(bankId, period);
    const volumeTrends = this.generateVolumeTrendsData(bankId, period);
    const transferDistribution = this.generateTransferTypeDistributionData(bankId, period);
    const networkPerformance = this.generateNetworkPerformanceData(bankId, period);
    const costSavings = this.generateCostSavingsData(bankId, period);
    
    return {
      period,
      bank_id: bankId,
      kpis,
      volume_trends: volumeTrends,
      transfer_distribution: transferDistribution,
      network_performance: networkPerformance,
      cost_savings: costSavings,
      generated_at: new Date().toISOString()
    };
  }

  // Helper methods

  /**
   * Get start date for a given period
   */
  getStartDateForPeriod(period) {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return startDate;
  }

  /**
   * Select network based on distribution
   */
  selectNetwork(distribution) {
    const networks = Object.keys(distribution);
    const weights = Object.values(distribution);
    return this.randomChoice(networks, weights);
  }

  /**
   * Select transfer type based on distribution
   */
  selectTransferType(distribution) {
    const types = Object.keys(distribution);
    const weights = Object.values(distribution);
    return this.randomChoice(types, weights);
  }

  /**
   * Calculate SWIFT equivalent fee
   */
  calculateSwiftFee(amount, transactionType) {
    const baseFee = 25; // Base SWIFT fee
    const correspondentFee = 15; // Correspondent bank fee
    const fxMargin = amount * 0.025; // 2.5% FX margin
    
    return baseFee + correspondentFee + fxMargin;
  }

  /**
   * Calculate Nexora fee
   */
  calculateNexoraFee(amount, network, transferType) {
    const networkFees = {
      polygon: 0.50,
      ethereum: 5.00,
      arbitrum: 2.00,
      base: 1.00,
      optimism: 1.50
    };
    
    const platformFee = amount * 0.001; // 0.1% platform fee
    const networkFee = networkFees[network] || 1.00;
    
    return networkFee + platformFee;
  }

  /**
   * Calculate settlement time based on network
   */
  calculateSettlementTime(processingTimeMinutes, network) {
    const networkMultipliers = {
      polygon: 0.5, // Faster
      ethereum: 1.0, // Standard
      arbitrum: 0.8, // Slightly faster
      base: 0.7, // Faster
      optimism: 0.9 // Slightly faster
    };
    
    const multiplier = networkMultipliers[network] || 1.0;
    return Math.floor(processingTimeMinutes * 60 * multiplier); // Convert to seconds
  }

  /**
   * Calculate success rate based on network and transfer type
   */
  calculateSuccessRate(network, transferType) {
    const baseRate = 98; // Base 98% success rate
    const networkAdjustments = {
      polygon: 1.5, // +1.5%
      ethereum: 0.5, // +0.5%
      arbitrum: 1.0, // +1.0%
      base: 1.2, // +1.2%
      optimism: 0.8 // +0.8%
    };
    
    const typeAdjustments = {
      interbank: 0.5,
      international: -0.5,
      domestic: 0.8,
      cross_border: -0.3,
      remittance: 0.2,
      liquidity_rebalancing: 0.3,
      merchant_settlement: 0.6,
      trade_finance: -0.2
    };
    
    const networkAdjustment = networkAdjustments[network] || 0;
    const typeAdjustment = typeAdjustments[transferType] || 0;
    
    return Math.min(100, Math.max(90, baseRate + networkAdjustment + typeAdjustment));
  }

  /**
   * Calculate processing efficiency
   */
  calculateProcessingEfficiency(settlementTimeSeconds, network) {
    const baselineTime = 300; // 5 minutes baseline
    const efficiency = (baselineTime - settlementTimeSeconds) / baselineTime * 100;
    return Math.max(0, Math.min(100, efficiency));
  }

  /**
   * Categorize volume
   */
  categorizeVolume(amount) {
    if (amount < 10000) return 'low';
    if (amount < 100000) return 'medium';
    if (amount < 1000000) return 'high';
    return 'very_high';
  }

  /**
   * Categorize frequency
   */
  categorizeFrequency(createdAt) {
    const hour = new Date(createdAt).getHours();
    if (hour >= 9 && hour <= 17) return 'business_hours';
    if (hour >= 18 && hour <= 22) return 'evening';
    return 'off_hours';
  }

  /**
   * Calculate complexity score
   */
  calculateComplexityScore(transaction, network, transferType) {
    let score = 50; // Base score
    
    // Network complexity
    const networkComplexity = {
      polygon: 20,
      ethereum: 80,
      arbitrum: 60,
      base: 40,
      optimism: 50
    };
    score += networkComplexity[network] || 50;
    
    // Transfer type complexity
    const typeComplexity = {
      interbank: 30,
      international: 90,
      domestic: 20,
      cross_border: 80,
      remittance: 60,
      liquidity_rebalancing: 70,
      merchant_settlement: 40,
      trade_finance: 85
    };
    score += typeComplexity[transferType] || 50;
    
    // Amount complexity
    if (transaction.amount > 100000) score += 20;
    if (transaction.amount > 1000000) score += 30;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate network distribution
   */
  generateNetworkDistribution() {
    return {
      polygon: Math.floor(Math.random() * 20) + 30, // 30-50%
      ethereum: Math.floor(Math.random() * 15) + 20, // 20-35%
      arbitrum: Math.floor(Math.random() * 10) + 15, // 15-25%
      base: Math.floor(Math.random() * 8) + 8, // 8-16%
      optimism: Math.floor(Math.random() * 5) + 5 // 5-10%
    };
  }

  /**
   * Generate transfer type distribution
   */
  generateTransferTypeDistribution() {
    return {
      interbank: Math.floor(Math.random() * 15) + 25, // 25-40%
      international: Math.floor(Math.random() * 10) + 20, // 20-30%
      domestic: Math.floor(Math.random() * 10) + 15, // 15-25%
      cross_border: Math.floor(Math.random() * 8) + 10, // 10-18%
      remittance: Math.floor(Math.random() * 5) + 5, // 5-10%
      liquidity_rebalancing: Math.floor(Math.random() * 5) + 5, // 5-10%
      merchant_settlement: Math.floor(Math.random() * 5) + 5, // 5-10%
      trade_finance: Math.floor(Math.random() * 3) + 2 // 2-5%
    };
  }

  /**
   * Check if date is a holiday
   */
  isHoliday(date) {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Simple holiday check (New Year, Christmas, etc.)
    if (month === 0 && day === 1) return true; // New Year
    if (month === 11 && day === 25) return true; // Christmas
    if (month === 6 && day === 4) return true; // Independence Day (US)
    
    return false;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Math.floor(Math.random() * 1000000) + 1;
  }
}

module.exports = AnalyticsTestDataGenerator; 