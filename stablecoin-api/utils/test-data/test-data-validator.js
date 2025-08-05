// Nexora Test Data Validator - Comprehensive Validation System
// Validates all generated test data for accuracy and realism

const TransactionDataGenerator = require('./TransactionDataGenerator');

class TestDataValidator {
  constructor() {
    this.dataGenerator = new TransactionDataGenerator();
    this.validationResults = {
      passed: 0,
      failed: 0,
      errors: [],
      warnings: []
    };
  }

  // Main validation method
  async validateAllData(data) {
    console.log('🔍 Starting comprehensive data validation...');
    
    try {
      // Validate banks
      await this.validateBanks(data.banks);
      
      // Validate users
      await this.validateUsers(data.users);
      
      // Validate wallets
      await this.validateWallets(data.wallets);
      
      // Validate transactions
      await this.validateTransactions(data.transactions);
      
      // Validate roles
      await this.validateRoles(data.roles);
      
      // Validate approval rules
      await this.validateApprovalRules(data.approvalRules);
      
      // Cross-entity validations
      await this.validateCrossEntityRelationships(data);
      
      // Regional pattern validations
      await this.validateRegionalPatterns(data);
      
      // Compliance validations
      await this.validateComplianceData(data);
      
      this.printValidationSummary();
      return this.validationResults;
      
    } catch (error) {
      console.error('❌ Validation error:', error);
      throw error;
    }
  }

  // Validate bank data
  async validateBanks(banks) {
    console.log('🏦 Validating banks...');
    
    for (const bank of banks) {
      // Required fields
      this.validateField(bank, 'bank_name', 'string', 'Bank name is required');
      this.validateField(bank, 'bank_code', 'string', 'Bank code is required');
      this.validateField(bank, 'api_key', 'string', 'API key is required');
      this.validateField(bank, 'api_secret', 'string', 'API secret is required');
      this.validateField(bank, 'contact_email', 'string', 'Contact email is required');
      this.validateField(bank, 'country', 'string', 'Country is required');
      
      // Country validation
      const validCountries = ['MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'DO', 'CO'];
      if (!validCountries.includes(bank.country)) {
        this.addError(`Invalid country code: ${bank.country} for bank ${bank.bank_name}`);
      }
      
      // Email format validation
      if (bank.contact_email && !this.isValidEmail(bank.contact_email)) {
        this.addError(`Invalid email format: ${bank.contact_email} for bank ${bank.bank_name}`);
      }
      
      // API key format validation
      if (bank.api_key && !bank.api_key.startsWith('sk_')) {
        this.addError(`Invalid API key format for bank ${bank.bank_name}`);
      }
      
      // Bank name realism
      if (bank.bank_name && bank.bank_name.length < 3) {
        this.addWarning(`Very short bank name: ${bank.bank_name}`);
      }
      
      // Tier validation
      if (bank.tier && !['tier1', 'tier2', 'tier3'].includes(bank.tier)) {
        this.addError(`Invalid tier: ${bank.tier} for bank ${bank.bank_name}`);
      }
    }
  }

  // Validate user data
  async validateUsers(users) {
    console.log('👥 Validating users...');
    
    for (const user of users) {
      // Required fields
      this.validateField(user, 'user_id', 'string', 'User ID is required');
      this.validateField(user, 'bank_id', 'number', 'Bank ID is required');
      this.validateField(user, 'email', 'string', 'Email is required');
      this.validateField(user, 'first_name', 'string', 'First name is required');
      this.validateField(user, 'last_name', 'string', 'Last name is required');
      this.validateField(user, 'role', 'string', 'Role is required');
      
      // Email format validation
      if (user.email && !this.isValidEmail(user.email)) {
        this.addError(`Invalid email format: ${user.email} for user ${user.first_name} ${user.last_name}`);
      }
      
      // Role validation
      const validRoles = ['viewer', 'operator', 'manager', 'admin'];
      if (!validRoles.includes(user.role)) {
        this.addError(`Invalid role: ${user.role} for user ${user.first_name} ${user.last_name}`);
      }
      
      // Name validation
      if (user.first_name && user.first_name.length < 2) {
        this.addWarning(`Very short first name: ${user.first_name} for user ${user.email}`);
      }
      
      if (user.last_name && user.last_name.length < 2) {
        this.addWarning(`Very short last name: ${user.last_name} for user ${user.email}`);
      }
      
      // Department validation
      if (user.department) {
        const validDepartments = ['treasury', 'compliance', 'operations', 'finance', 'risk', 'audit'];
        if (!validDepartments.includes(user.department)) {
          this.addWarning(`Unknown department: ${user.department} for user ${user.email}`);
        }
      }
    }
  }

  // Validate wallet data
  async validateWallets(wallets) {
    console.log('💼 Validating wallets...');
    
    for (const wallet of wallets) {
      // Required fields
      this.validateField(wallet, 'wallet_id', 'string', 'Wallet ID is required');
      this.validateField(wallet, 'bank_id', 'number', 'Bank ID is required');
      this.validateField(wallet, 'wallet_name', 'string', 'Wallet name is required');
      this.validateField(wallet, 'currency', 'string', 'Currency is required');
      this.validateField(wallet, 'wallet_type', 'string', 'Wallet type is required');
      this.validateField(wallet, 'balance', 'number', 'Balance is required');
      
      // Currency validation
      if (!this.dataGenerator.currencies.includes(wallet.currency)) {
        this.addError(`Invalid currency: ${wallet.currency} for wallet ${wallet.wallet_name}`);
      }
      
      // Balance validation
      if (wallet.balance < 0) {
        this.addError(`Negative balance: ${wallet.balance} for wallet ${wallet.wallet_name}`);
      }
      
      // Wallet type validation
      const validTypes = ['main_treasury', 'fx_reserve', 'settlement', 'emergency', 'correspondent', 'nostro', 'vostro', 'regulatory_reserve'];
      if (!validTypes.includes(wallet.wallet_type)) {
        this.addError(`Invalid wallet type: ${wallet.wallet_type} for wallet ${wallet.wallet_name}`);
      }
      
      // Account number validation
      if (wallet.account_number && wallet.account_number.length < 10) {
        this.addWarning(`Short account number: ${wallet.account_number} for wallet ${wallet.wallet_name}`);
      }
      
      // Status validation
      if (wallet.status && !['active', 'inactive', 'maintenance', 'suspended'].includes(wallet.status)) {
        this.addWarning(`Unknown wallet status: ${wallet.status} for wallet ${wallet.wallet_name}`);
      }
    }
  }

  // Validate transaction data
  async validateTransactions(transactions) {
    console.log('💸 Validating transactions...');
    
    for (const transaction of transactions) {
      // Required fields
      this.validateField(transaction, 'transaction_id', 'string', 'Transaction ID is required');
      this.validateField(transaction, 'source_wallet_id', 'string', 'Source wallet ID is required');
      this.validateField(transaction, 'destination_wallet_id', 'string', 'Destination wallet ID is required');
      this.validateField(transaction, 'amount', 'number', 'Amount is required');
      this.validateField(transaction, 'currency', 'string', 'Currency is required');
      this.validateField(transaction, 'transaction_type', 'string', 'Transaction type is required');
      this.validateField(transaction, 'status', 'string', 'Status is required');
      this.validateField(transaction, 'reference', 'string', 'Reference is required');
      
      // Amount validation
      if (transaction.amount <= 0) {
        this.addError(`Invalid amount: ${transaction.amount} for transaction ${transaction.reference}`);
      }
      
      // Currency validation
      if (!this.dataGenerator.currencies.includes(transaction.currency)) {
        this.addError(`Invalid currency: ${transaction.currency} for transaction ${transaction.reference}`);
      }
      
      // Transaction type validation
      if (!this.dataGenerator.transactionTypes.includes(transaction.transaction_type)) {
        this.addError(`Invalid transaction type: ${transaction.transaction_type} for transaction ${transaction.reference}`);
      }
      
      // Status validation
      const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(transaction.status)) {
        this.addError(`Invalid status: ${transaction.status} for transaction ${transaction.reference}`);
      }
      
      // Reference format validation
      if (transaction.reference && !transaction.reference.includes('-')) {
        this.addWarning(`Unusual reference format: ${transaction.reference}`);
      }
      
      // Fees validation
      if (transaction.fees < 0) {
        this.addError(`Negative fees: ${transaction.fees} for transaction ${transaction.reference}`);
      }
      
      // Exchange rate validation
      if (transaction.exchange_rate && transaction.exchange_rate <= 0) {
        this.addError(`Invalid exchange rate: ${transaction.exchange_rate} for transaction ${transaction.reference}`);
      }
      
      // Compliance score validation
      if (transaction.compliance_score && (transaction.compliance_score < 1 || transaction.compliance_score > 100)) {
        this.addError(`Invalid compliance score: ${transaction.compliance_score} for transaction ${transaction.reference}`);
      }
      
      // Risk level validation
      if (transaction.risk_level && !['low', 'medium', 'high'].includes(transaction.risk_level)) {
        this.addError(`Invalid risk level: ${transaction.risk_level} for transaction ${transaction.reference}`);
      }
      
      // Processing time validation
      if (transaction.processing_time_minutes && transaction.processing_time_minutes < 0) {
        this.addError(`Negative processing time: ${transaction.processing_time_minutes} for transaction ${transaction.reference}`);
      }
    }
  }

  // Validate roles
  async validateRoles(roles) {
    console.log('🔐 Validating roles...');
    
    for (const role of roles) {
      // Required fields
      this.validateField(role, 'bank_id', 'number', 'Bank ID is required');
      this.validateField(role, 'role_name', 'string', 'Role name is required');
      this.validateField(role, 'role_level', 'number', 'Role level is required');
      this.validateField(role, 'permissions', 'string', 'Permissions are required');
      
      // Role level validation
      if (role.role_level < 1 || role.role_level > 10) {
        this.addError(`Invalid role level: ${role.role_level} for role ${role.role_name}`);
      }
      
      // Role name validation
      const validRoleNames = ['Viewer', 'Operator', 'Manager', 'Admin'];
      if (!validRoleNames.includes(role.role_name)) {
        this.addError(`Invalid role name: ${role.role_name}`);
      }
      
      // Max transfer amount validation
      if (role.max_transfer_amount && role.max_transfer_amount < 0) {
        this.addError(`Negative max transfer amount: ${role.max_transfer_amount} for role ${role.role_name}`);
      }
      
      // Boolean field validation
      if (typeof role.can_approve_transfers !== 'boolean') {
        this.addError(`Invalid can_approve_transfers value for role ${role.role_name}`);
      }
      
      if (typeof role.can_create_users !== 'boolean') {
        this.addError(`Invalid can_create_users value for role ${role.role_name}`);
      }
      
      if (typeof role.can_modify_settings !== 'boolean') {
        this.addError(`Invalid can_modify_settings value for role ${role.role_name}`);
      }
    }
  }

  // Validate approval rules
  async validateApprovalRules(rules) {
    console.log('📋 Validating approval rules...');
    
    for (const rule of rules) {
      // Required fields
      this.validateField(rule, 'bank_id', 'number', 'Bank ID is required');
      this.validateField(rule, 'rule_name', 'string', 'Rule name is required');
      this.validateField(rule, 'min_amount', 'number', 'Min amount is required');
      this.validateField(rule, 'required_role_level', 'number', 'Required role level is required');
      this.validateField(rule, 'required_approvals', 'number', 'Required approvals is required');
      
      // Amount validation
      if (rule.min_amount < 0) {
        this.addError(`Negative min amount: ${rule.min_amount} for rule ${rule.rule_name}`);
      }
      
      if (rule.max_amount && rule.max_amount <= rule.min_amount) {
        this.addError(`Invalid amount range: min ${rule.min_amount}, max ${rule.max_amount} for rule ${rule.rule_name}`);
      }
      
      // Role level validation
      if (rule.required_role_level < 1 || rule.required_role_level > 10) {
        this.addError(`Invalid required role level: ${rule.required_role_level} for rule ${rule.rule_name}`);
      }
      
      // Required approvals validation
      if (rule.required_approvals < 0) {
        this.addError(`Negative required approvals: ${rule.required_approvals} for rule ${rule.rule_name}`);
      }
      
      // Auto approve validation
      if (typeof rule.auto_approve !== 'boolean') {
        this.addError(`Invalid auto_approve value for rule ${rule.rule_name}`);
      }
    }
  }

  // Cross-entity relationship validation
  async validateCrossEntityRelationships(data) {
    console.log('🔗 Validating cross-entity relationships...');
    
    // Validate that all users have valid bank references
    for (const user of data.users) {
      const bankExists = data.banks.find(bank => bank.id === user.bank_id);
      if (!bankExists) {
        this.addError(`User ${user.email} references non-existent bank ID: ${user.bank_id}`);
      }
    }
    
    // Validate that all wallets have valid bank references
    for (const wallet of data.wallets) {
      const bankExists = data.banks.find(bank => bank.id === wallet.bank_id);
      if (!bankExists) {
        this.addError(`Wallet ${wallet.wallet_name} references non-existent bank ID: ${wallet.bank_id}`);
      }
    }
    
    // Validate that all transactions have valid wallet references
    for (const transaction of data.transactions) {
      const sourceWalletExists = data.wallets.find(wallet => wallet.wallet_id === transaction.source_wallet_id);
      const destWalletExists = data.wallets.find(wallet => wallet.wallet_id === transaction.destination_wallet_id);
      
      if (!sourceWalletExists) {
        this.addError(`Transaction ${transaction.reference} references non-existent source wallet: ${transaction.source_wallet_id}`);
      }
      
      if (!destWalletExists) {
        this.addError(`Transaction ${transaction.reference} references non-existent destination wallet: ${transaction.destination_wallet_id}`);
      }
    }
    
    // Validate that all roles have valid bank references
    for (const role of data.roles) {
      const bankExists = data.banks.find(bank => bank.id === role.bank_id);
      if (!bankExists) {
        this.addError(`Role ${role.role_name} references non-existent bank ID: ${role.bank_id}`);
      }
    }
    
    // Validate that all approval rules have valid bank references
    for (const rule of data.approvalRules) {
      const bankExists = data.banks.find(bank => bank.id === rule.bank_id);
      if (!bankExists) {
        this.addError(`Approval rule ${rule.rule_name} references non-existent bank ID: ${rule.bank_id}`);
      }
    }
  }

  // Regional pattern validation
  async validateRegionalPatterns(data) {
    console.log('🌍 Validating regional patterns...');
    
    // Validate remittance patterns for high-remittance countries
    const highRemittanceCountries = ['SV', 'HN', 'DO', 'GT', 'NI'];
    const remittanceTransactions = data.transactions.filter(tx => 
      tx.transaction_type === 'REMITTANCE' && 
      highRemittanceCountries.includes(tx.source_country)
    );
    
    if (remittanceTransactions.length === 0) {
      this.addWarning('No remittance transactions found for high-remittance countries');
    }
    
    // Validate financial hub patterns
    const financialHubCountries = ['PA', 'BZ'];
    const tradeFinanceTransactions = data.transactions.filter(tx => 
      tx.transaction_type === 'TRADE_FINANCE' && 
      (financialHubCountries.includes(tx.source_country) || financialHubCountries.includes(tx.destination_country))
    );
    
    if (tradeFinanceTransactions.length === 0) {
      this.addWarning('No trade finance transactions found for financial hub countries');
    }
    
    // Validate cross-border transaction patterns
    const crossBorderTransactions = data.transactions.filter(tx => tx.source_country !== tx.destination_country);
    const domesticTransactions = data.transactions.filter(tx => tx.source_country === tx.destination_country);
    
    if (crossBorderTransactions.length === 0) {
      this.addWarning('No cross-border transactions found');
    }
    
    if (domesticTransactions.length === 0) {
      this.addWarning('No domestic transactions found');
    }
    
    // Validate currency patterns by country
    for (const bank of data.banks) {
      const bankWallets = data.wallets.filter(wallet => wallet.bank_id === bank.id);
      const currencies = [...new Set(bankWallets.map(wallet => wallet.currency))];
      
      if (currencies.length === 0) {
        this.addError(`No wallets found for bank ${bank.bank_name}`);
      }
      
      // Validate that El Salvador banks have USD wallets (El Salvador uses USD)
      if (bank.country === 'SV' && !currencies.includes('USD')) {
        this.addWarning(`El Salvador bank ${bank.bank_name} should have USD wallets`);
      }
    }
  }

  // Compliance data validation
  async validateComplianceData(data) {
    console.log('🔒 Validating compliance data...');
    
    // Validate high-value transaction compliance
    const highValueTransactions = data.transactions.filter(tx => tx.amount > 100000);
    for (const tx of highValueTransactions) {
      if (!tx.anti_money_laundering_check) {
        this.addWarning(`High-value transaction ${tx.reference} should have AML check`);
      }
      
      if (tx.transaction_type === 'CROSS_BORDER_PAYMENT' && !tx.regulatory_reporting) {
        this.addWarning(`Cross-border high-value transaction ${tx.reference} should have regulatory reporting`);
      }
    }
    
    // Validate cross-border compliance
    const crossBorderTransactions = data.transactions.filter(tx => 
      tx.transaction_type === 'CROSS_BORDER_PAYMENT'
    );
    
    for (const tx of crossBorderTransactions) {
      if (!tx.sanctions_screening) {
        this.addWarning(`Cross-border transaction ${tx.reference} should have sanctions screening`);
      }
    }
    
    // Validate compliance scores
    for (const tx of data.transactions) {
      if (tx.compliance_score && (tx.compliance_score < 1 || tx.compliance_score > 100)) {
        this.addError(`Invalid compliance score: ${tx.compliance_score} for transaction ${tx.reference}`);
      }
    }
  }

  // Utility methods
  validateField(obj, field, type, message) {
    if (!obj[field]) {
      this.addError(`${message}: ${field} is missing`);
      return;
    }
    
    if (typeof obj[field] !== type) {
      this.addError(`${message}: ${field} should be ${type}, got ${typeof obj[field]}`);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addError(message) {
    this.validationResults.failed++;
    this.validationResults.errors.push(message);
  }

  addWarning(message) {
    this.validationResults.warnings.push(message);
  }

  printValidationSummary() {
    console.log('\n📊 Validation Summary:');
    console.log('=' * 30);
    console.log(`✅ Passed: ${this.validationResults.passed}`);
    console.log(`❌ Failed: ${this.validationResults.failed}`);
    console.log(`⚠️ Warnings: ${this.validationResults.warnings.length}`);
    
    if (this.validationResults.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.validationResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (this.validationResults.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.validationResults.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }
    
    const successRate = this.validationResults.failed === 0 ? 100 : 
      Math.round((this.validationResults.passed / (this.validationResults.passed + this.validationResults.failed)) * 100);
    
    console.log(`\n📈 Success Rate: ${successRate}%`);
    
    if (successRate === 100) {
      console.log('🎉 All validations passed!');
    } else {
      console.log('⚠️ Some validations failed. Please review the errors above.');
    }
  }
}

module.exports = TestDataValidator; 