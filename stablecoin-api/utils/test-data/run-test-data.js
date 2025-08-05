#!/usr/bin/env node

// Nexora Test Data Runner - Complete Central America + Caribbean Banking Data
// Main script to generate comprehensive test data for all supported countries

const TestDataLoader = require('./TestDataLoader');

async function main() {
  console.log('🚀 Nexora Test Data Generator - Central America + Caribbean');
  console.log('=' * 60);
  
  const loader = new TestDataLoader();
  
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = parseArguments(args);
    
    if (options.clear) {
      console.log('🧹 Clearing all existing test data...');
      await loader.clearAllTestData();
      console.log('✅ Test data cleared successfully!');
      return;
    }
    
    if (options.help) {
      printHelp();
      return;
    }
    
    // Load all test data
    const generatedData = await loader.loadAllTestData(options);
    
    console.log('\n🎉 Test data generation completed successfully!');
    console.log('=' * 60);
    
    // Print detailed summary
    printDetailedSummary(generatedData);
    
    // Export data if requested
    if (options.export) {
      await exportData(generatedData, options.export);
    }
    
  } catch (error) {
    console.error('❌ Error running test data generator:', error);
    process.exit(1);
  }
}

function parseArguments(args) {
  const options = {
    bankCount: 15,
    transactionCount: 200,
    clear: false,
    help: false,
    export: null
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--banks':
      case '-b':
        options.bankCount = parseInt(args[++i]) || 15;
        break;
        
      case '--transactions':
      case '-t':
        options.transactionCount = parseInt(args[++i]) || 200;
        break;
        
      case '--clear':
      case '-c':
        options.clear = true;
        break;
        
      case '--help':
      case '-h':
        options.help = true;
        break;
        
      case '--export':
      case '-e':
        options.export = args[++i] || 'test-data.json';
        break;
        
      default:
        console.warn(`⚠️ Unknown argument: ${arg}`);
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
📋 Nexora Test Data Generator - Usage

Options:
  -b, --banks <count>        Number of banks to generate (default: 15)
  -t, --transactions <count>  Number of transactions to generate (default: 200)
  -c, --clear                Clear all existing test data
  -e, --export <file>        Export generated data to JSON file
  -h, --help                 Show this help message

Examples:
  node run-test-data.js
  node run-test-data.js --banks 20 --transactions 500
  node run-test-data.js --clear
  node run-test-data.js --export test-data.json

Supported Countries:
  🇲🇽 Mexico (MX)
  🇬🇹 Guatemala (GT)
  🇧🇿 Belize (BZ)
  🇸🇻 El Salvador (SV)
  🇭🇳 Honduras (HN)
  🇳🇮 Nicaragua (NI)
  🇨🇷 Costa Rica (CR)
  🇵🇦 Panama (PA)
  🇩🇴 Dominican Republic (DO)
  🇨🇴 Colombia (CO)

Features:
  ✅ Realistic bank profiles with proper licensing
  ✅ Multi-currency wallet support
  ✅ Regional transaction patterns
  ✅ Role-based access control
  ✅ Approval workflow rules
  ✅ Compliance and regulatory data
  ✅ Cross-border remittance patterns
  ✅ Financial hub operations (Panama, Belize)
  ✅ High remittance activity (El Salvador, Honduras, Dominican Republic)
  `);
}

function printDetailedSummary(data) {
  console.log('\n📊 Detailed Data Summary:');
  console.log('=' * 40);
  
  // Banks by country
  console.log('\n🏦 Banks by Country:');
  const countryBreakdown = {};
  data.banks.forEach(bank => {
    countryBreakdown[bank.country] = (countryBreakdown[bank.country] || 0) + 1;
  });
  
  Object.entries(countryBreakdown).forEach(([country, count]) => {
    const countryNames = {
      'MX': 'Mexico',
      'GT': 'Guatemala',
      'BZ': 'Belize',
      'SV': 'El Salvador',
      'HN': 'Honduras',
      'NI': 'Nicaragua',
      'CR': 'Costa Rica',
      'PA': 'Panama',
      'DO': 'Dominican Republic',
      'CO': 'Colombia'
    };
    console.log(`  ${countryNames[country] || country}: ${count} banks`);
  });
  
  // Users by role
  console.log('\n👥 Users by Role:');
  const roleBreakdown = {};
  data.users.forEach(user => {
    roleBreakdown[user.role] = (roleBreakdown[user.role] || 0) + 1;
  });
  
  Object.entries(roleBreakdown).forEach(([role, count]) => {
    console.log(`  ${role}: ${count} users`);
  });
  
  // Wallets by currency
  console.log('\n💼 Wallets by Currency:');
  const currencyBreakdown = {};
  data.wallets.forEach(wallet => {
    currencyBreakdown[wallet.currency] = (currencyBreakdown[wallet.currency] || 0) + 1;
  });
  
  Object.entries(currencyBreakdown).forEach(([currency, count]) => {
    console.log(`  ${currency}: ${count} wallets`);
  });
  
  // Transactions by type
  console.log('\n💸 Transactions by Type:');
  const transactionTypeBreakdown = {};
  data.transactions.forEach(tx => {
    transactionTypeBreakdown[tx.transaction_type] = (transactionTypeBreakdown[tx.transaction_type] || 0) + 1;
  });
  
  Object.entries(transactionTypeBreakdown).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} transactions`);
  });
  
  // Transactions by status
  console.log('\n📈 Transactions by Status:');
  const statusBreakdown = {};
  data.transactions.forEach(tx => {
    statusBreakdown[tx.status] = (statusBreakdown[tx.status] || 0) + 1;
  });
  
  Object.entries(statusBreakdown).forEach(([status, count]) => {
    console.log(`  ${status}: ${count} transactions`);
  });
  
  // Regional vs domestic transactions
  const regionalCount = data.transactions.filter(tx => tx.is_regional).length;
  const domesticCount = data.transactions.length - regionalCount;
  
  console.log('\n🌍 Transaction Geography:');
  console.log(`  Regional (cross-border): ${regionalCount} transactions`);
  console.log(`  Domestic: ${domesticCount} transactions`);
  
  // High-value transactions
  const highValueCount = data.transactions.filter(tx => tx.amount > 100000).length;
  console.log(`  High-value (>$100k): ${highValueCount} transactions`);
  
  // Compliance data
  const complianceCount = data.transactions.filter(tx => tx.regulatory_reporting).length;
  const amlCount = data.transactions.filter(tx => tx.anti_money_laundering_check).length;
  const sanctionsCount = data.transactions.filter(tx => tx.sanctions_screening).length;
  
  console.log('\n🔒 Compliance Data:');
  console.log(`  Regulatory reporting: ${complianceCount} transactions`);
  console.log(`  AML checks: ${amlCount} transactions`);
  console.log(`  Sanctions screening: ${sanctionsCount} transactions`);
}

async function exportData(data, filename) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    const filepath = path.join(exportsDir, filename);
    
    // Prepare data for export (remove sensitive info)
    const exportData = {
      generated_at: new Date().toISOString(),
      summary: {
        banks: data.banks.length,
        users: data.users.length,
        wallets: data.wallets.length,
        transactions: data.transactions.length,
        roles: data.roles.length,
        approvalRules: data.approvalRules.length
      },
      banks: data.banks.map(bank => ({
        id: bank.id,
        bank_name: bank.bank_name,
        bank_code: bank.bank_code,
        country: bank.country,
        contact_email: bank.contact_email,
        tier: bank.tier,
        status: bank.status,
        created_at: bank.created_at
      })),
      users: data.users.map(user => ({
        id: user.id,
        user_id: user.user_id,
        bank_id: user.bank_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        department: user.department,
        status: user.status
      })),
      wallets: data.wallets.map(wallet => ({
        id: wallet.id,
        wallet_id: wallet.wallet_id,
        bank_id: wallet.bank_id,
        wallet_name: wallet.wallet_name,
        currency: wallet.currency,
        wallet_type: wallet.wallet_type,
        balance: wallet.balance,
        status: wallet.status
      })),
      transactions: data.transactions.map(tx => ({
        id: tx.id,
        transaction_id: tx.transaction_id,
        source_wallet_id: tx.source_wallet_id,
        destination_wallet_id: tx.destination_wallet_id,
        amount: tx.amount,
        currency: tx.currency,
        transaction_type: tx.transaction_type,
        status: tx.status,
        reference: tx.reference,
        description: tx.description,
        fees: tx.fees,
        sender_name: tx.sender_name,
        receiver_name: tx.receiver_name,
        purpose_code: tx.purpose_code,
        compliance_score: tx.compliance_score,
        risk_level: tx.risk_level,
        source_country: tx.source_country,
        destination_country: tx.destination_country,
        is_regional: tx.is_regional,
        created_at: tx.created_at
      })),
      roles: data.roles.map(role => ({
        id: role.id,
        bank_id: role.bank_id,
        role_name: role.role_name,
        role_level: role.role_level,
        permissions: role.permissions,
        max_transfer_amount: role.max_transfer_amount,
        can_approve_transfers: role.can_approve_transfers,
        can_create_users: role.can_create_users,
        can_modify_settings: role.can_modify_settings
      })),
      approvalRules: data.approvalRules.map(rule => ({
        id: rule.id,
        bank_id: rule.bank_id,
        rule_name: rule.rule_name,
        min_amount: rule.min_amount,
        max_amount: rule.max_amount,
        required_role_level: rule.required_role_level,
        required_approvals: rule.required_approvals,
        auto_approve: rule.auto_approve
      }))
    };
    
    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
    console.log(`\n💾 Data exported to: ${filepath}`);
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main, parseArguments, printHelp, printDetailedSummary, exportData }; 