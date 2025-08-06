#!/usr/bin/env node

/**
 * Analytics Test Data Runner
 * Generates analytics-specific test data for the Nexora analytics system
 */

const AnalyticsTestDataGenerator = require('./AnalyticsTestDataGenerator');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Nexora Analytics Test Data Generator');
  console.log('=' * 50);
  
  const generator = new AnalyticsTestDataGenerator();
  
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = parseArguments(args);
    
    if (options.help) {
      printHelp();
      return;
    }
    
    console.log(`📊 Generating analytics test data for period: ${options.period}`);
    console.log(`🏦 Bank ID: ${options.bankId || 'All banks'}`);
    console.log(`📈 Transaction count: ${options.transactionCount}`);
    
    // Generate base test data first
    console.log('\n🔄 Generating base test data...');
    const banks = generator.generateBankProfiles(options.bankCount);
    const users = await generator.generateUsersForBanks(banks);
    const wallets = await generator.generateWalletsForBanks(banks);
    
    console.log(`✅ Generated ${banks.length} banks, ${users.length} users, ${wallets.length} wallets`);
    
    // Generate analytics-specific data
    console.log('\n📊 Generating analytics test data...');
    
    const analyticsData = {
      generated_at: new Date().toISOString(),
      summary: {
        banks: banks.length,
        users: users.length,
        wallets: wallets.length,
        analytics_transactions: 0,
        daily_analytics: 0,
        network_performance: 0,
        cost_savings: 0
      },
      banks,
      users,
      wallets,
      analytics_transactions: [],
      daily_analytics: [],
      network_performance: [],
      cost_savings: [],
      kpis: [],
      volume_trends: [],
      transfer_distributions: [],
      dashboard_data: []
    };
    
    // Generate analytics transactions
    console.log('🔄 Generating analytics transactions...');
    const analyticsTransactions = await generator.generateAnalyticsTransactions(
      banks, 
      wallets, 
      users, 
      {
        period: options.period,
        bankId: options.bankId,
        networkDistribution: options.networkDistribution,
        transferTypeDistribution: options.transferTypeDistribution
      }
    );
    
    analyticsData.analytics_transactions = analyticsTransactions;
    analyticsData.summary.analytics_transactions = analyticsTransactions.length;
    
    console.log(`✅ Generated ${analyticsTransactions.length} analytics transactions`);
    
    // Generate daily analytics for each bank
    console.log('🔄 Generating daily analytics...');
    for (const bank of banks) {
      const dailyAnalytics = await generator.generateDailyAnalytics(bank.id, options.period);
      analyticsData.daily_analytics.push(...dailyAnalytics);
    }
    
    analyticsData.summary.daily_analytics = analyticsData.daily_analytics.length;
    console.log(`✅ Generated ${analyticsData.daily_analytics.length} daily analytics records`);
    
    // Generate network performance data
    console.log('🔄 Generating network performance data...');
    for (const bank of banks) {
      const networkPerformance = generator.generateNetworkPerformanceData(bank.id, options.period);
      analyticsData.network_performance.push(...networkPerformance);
    }
    
    analyticsData.summary.network_performance = analyticsData.network_performance.length;
    console.log(`✅ Generated ${analyticsData.network_performance.length} network performance records`);
    
    // Generate cost savings data
    console.log('🔄 Generating cost savings data...');
    for (const bank of banks) {
      const costSavings = generator.generateCostSavingsData(bank.id, options.period);
      analyticsData.cost_savings.push(costSavings);
    }
    
    analyticsData.summary.cost_savings = analyticsData.cost_savings.length;
    console.log(`✅ Generated ${analyticsData.cost_savings.length} cost savings records`);
    
    // Generate KPI data
    console.log('🔄 Generating KPI data...');
    for (const bank of banks) {
      const kpis = generator.generateKPIData(bank.id, options.period);
      analyticsData.kpis.push(kpis);
    }
    
    console.log(`✅ Generated ${analyticsData.kpis.length} KPI records`);
    
    // Generate volume trends
    console.log('🔄 Generating volume trends...');
    for (const bank of banks) {
      const volumeTrends = generator.generateVolumeTrendsData(bank.id, options.period);
      analyticsData.volume_trends.push({
        bank_id: bank.id,
        period: options.period,
        trends: volumeTrends
      });
    }
    
    console.log(`✅ Generated volume trends for ${analyticsData.volume_trends.length} banks`);
    
    // Generate transfer distributions
    console.log('🔄 Generating transfer distributions...');
    for (const bank of banks) {
      const transferDistribution = generator.generateTransferTypeDistributionData(bank.id, options.period);
      analyticsData.transfer_distributions.push({
        bank_id: bank.id,
        period: options.period,
        distribution: transferDistribution
      });
    }
    
    console.log(`✅ Generated transfer distributions for ${analyticsData.transfer_distributions.length} banks`);
    
    // Generate dashboard data
    console.log('🔄 Generating dashboard data...');
    for (const bank of banks) {
      const dashboardData = await generator.generateAnalyticsDashboardData(bank.id, options.period);
      analyticsData.dashboard_data.push(dashboardData);
    }
    
    console.log(`✅ Generated dashboard data for ${analyticsData.dashboard_data.length} banks`);
    
    // Export data
    if (options.export) {
      await exportData(analyticsData, options.export);
    }
    
    // Print summary
    printAnalyticsSummary(analyticsData);
    
    console.log('\n🎉 Analytics test data generation completed successfully!');
    console.log('=' * 50);
    
  } catch (error) {
    console.error('❌ Error generating analytics test data:', error);
    process.exit(1);
  }
}

function parseArguments(args) {
  const options = {
    bankCount: 5,
    transactionCount: 200,
    period: '30d',
    bankId: null,
    networkDistribution: { polygon: 0.4, ethereum: 0.3, arbitrum: 0.2, base: 0.1 },
    transferTypeDistribution: { interbank: 0.3, international: 0.25, domestic: 0.2, cross_border: 0.15, remittance: 0.1 },
    export: 'analytics-test-data.json',
    help: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--banks':
      case '-b':
        options.bankCount = parseInt(args[++i]) || 5;
        break;
        
      case '--transactions':
      case '-t':
        options.transactionCount = parseInt(args[++i]) || 200;
        break;
        
      case '--period':
      case '-p':
        options.period = args[++i] || '30d';
        break;
        
      case '--bank-id':
      case '-i':
        options.bankId = parseInt(args[++i]);
        break;
        
      case '--export':
      case '-e':
        options.export = args[++i] || 'analytics-test-data.json';
        break;
        
      case '--help':
      case '-h':
        options.help = true;
        break;
        
      default:
        console.warn(`⚠️ Unknown argument: ${arg}`);
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
📋 Analytics Test Data Generator - Usage

Options:
  -b, --banks <count>           Number of banks to generate (default: 5)
  -t, --transactions <count>     Number of transactions to generate (default: 200)
  -p, --period <period>          Time period: 7d, 30d, 90d, 1y (default: 30d)
  -i, --bank-id <id>            Specific bank ID to generate data for
  -e, --export <filename>        Export filename (default: analytics-test-data.json)
  -h, --help                     Show this help message

Examples:
  node run-analytics-test-data.js
  node run-analytics-test-data.js --banks 10 --period 90d
  node run-analytics-test-data.js --bank-id 41 --period 7d
  node run-analytics-test-data.js --export my-analytics-data.json

Generated Data:
  - Analytics transactions with network and cost data
  - Daily analytics metrics
  - Network performance data
  - Cost savings analysis
  - KPI data
  - Volume trends
  - Transfer distributions
  - Dashboard data
`);
}

async function exportData(data, filename) {
  const exportPath = path.join(__dirname, 'exports', filename);
  
  // Ensure exports directory exists
  const exportsDir = path.dirname(exportPath);
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  
  // Write data to file
  fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
  console.log(`💾 Exported analytics test data to: ${exportPath}`);
}

function printAnalyticsSummary(data) {
  console.log('\n📊 Analytics Test Data Summary');
  console.log('=' * 40);
  
  console.log(`🏦 Banks: ${data.summary.banks}`);
  console.log(`👥 Users: ${data.summary.users}`);
  console.log(`💼 Wallets: ${data.summary.wallets}`);
  console.log(`📈 Analytics Transactions: ${data.summary.analytics_transactions}`);
  console.log(`📅 Daily Analytics Records: ${data.summary.daily_analytics}`);
  console.log(`🌐 Network Performance Records: ${data.summary.network_performance}`);
  console.log(`💰 Cost Savings Records: ${data.summary.cost_savings}`);
  
  console.log('\n📊 Data Breakdown:');
  
  // Network distribution
  const networkStats = {};
  data.analytics_transactions.forEach(tx => {
    networkStats[tx.network_used] = (networkStats[tx.network_used] || 0) + 1;
  });
  
  console.log('\n🌐 Network Distribution:');
  Object.entries(networkStats).forEach(([network, count]) => {
    const percentage = ((count / data.analytics_transactions.length) * 100).toFixed(1);
    console.log(`  ${network}: ${count} (${percentage}%)`);
  });
  
  // Transfer type distribution
  const transferTypeStats = {};
  data.analytics_transactions.forEach(tx => {
    transferTypeStats[tx.transfer_type] = (transferTypeStats[tx.transfer_type] || 0) + 1;
  });
  
  console.log('\n📤 Transfer Type Distribution:');
  Object.entries(transferTypeStats).forEach(([type, count]) => {
    const percentage = ((count / data.analytics_transactions.length) * 100).toFixed(1);
    console.log(`  ${type}: ${count} (${percentage}%)`);
  });
  
  // Cost savings summary
  const totalSavings = data.analytics_transactions.reduce((sum, tx) => sum + tx.fee_savings, 0);
  const avgSavings = totalSavings / data.analytics_transactions.length;
  
  console.log('\n💰 Cost Savings Summary:');
  console.log(`  Total Savings: $${totalSavings.toLocaleString()}`);
  console.log(`  Average Savings per Transaction: $${avgSavings.toFixed(2)}`);
  console.log(`  Total Transactions: ${data.analytics_transactions.length}`);
  
  // Performance metrics
  const avgSettlementTime = data.analytics_transactions.reduce((sum, tx) => sum + tx.settlement_time_seconds, 0) / data.analytics_transactions.length;
  const avgSuccessRate = data.analytics_transactions.reduce((sum, tx) => sum + tx.success_rate, 0) / data.analytics_transactions.length;
  
  console.log('\n⚡ Performance Metrics:');
  console.log(`  Average Settlement Time: ${avgSettlementTime.toFixed(1)} seconds`);
  console.log(`  Average Success Rate: ${avgSuccessRate.toFixed(1)}%`);
  
  // Volume categories
  const volumeStats = {};
  data.analytics_transactions.forEach(tx => {
    volumeStats[tx.volume_category] = (volumeStats[tx.volume_category] || 0) + 1;
  });
  
  console.log('\n📊 Volume Categories:');
  Object.entries(volumeStats).forEach(([category, count]) => {
    const percentage = ((count / data.analytics_transactions.length) * 100).toFixed(1);
    console.log(`  ${category}: ${count} (${percentage}%)`);
  });
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, parseArguments, printHelp, exportData, printAnalyticsSummary }; 