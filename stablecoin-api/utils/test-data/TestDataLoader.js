// Nexora Test Data Loader - Automatic Feature Detection and Data Generation
// Automatically detects new features and generates appropriate test data

const TransactionDataGenerator = require('./TransactionDataGenerator');
const db = require('../../database/connection');

class TestDataLoader {
  constructor() {
    this.dataGenerator = new TransactionDataGenerator();
    this.featureRegistry = new Map();
    this.generatedData = {
      banks: [],
      users: [],
      wallets: [],
      transactions: [],
      roles: [],
      approvalRules: []
    };
  }

  // Main method to load all test data
  async loadAllTestData(options = {}) {
    console.log('🚀 Starting comprehensive test data generation...');
    
    try {
      // Detect available features
      await this.detectFeatures();
      
      // Generate and load banks
      await this.generateAndLoadBanks(options.bankCount || 15);
      
      // Generate and load users
      await this.generateAndLoadUsers();
      
      // Generate and load wallets
      await this.generateAndLoadWallets();
      
      // Generate and load transactions
      await this.generateAndLoadTransactions(options.transactionCount || 200);
      
      // Generate and load roles and approval rules
      await this.generateAndLoadRolesAndApprovals();
      
      // Validate all generated data
      await this.validateGeneratedData();
      
      console.log('✅ All test data generated and loaded successfully!');
      this.printDataSummary();
      
      return this.generatedData;
    } catch (error) {
      console.error('❌ Error loading test data:', error);
      throw error;
    }
  }

  // Automatically detect available features in the system
  async detectFeatures() {
    console.log('🔍 Detecting system features...');
    
    try {
      // Check database schema for available tables
      const tables = await this.getAvailableTables();
      
      // Register detected features
      this.registerFeature('banks', tables.includes('banks'));
      this.registerFeature('users', tables.includes('bank_users'));
      this.registerFeature('wallets', tables.includes('fbo_wallets'));
      this.registerFeature('transactions', tables.includes('transaction_records'));
      this.registerFeature('roles', tables.includes('roles'));
      this.registerFeature('approval_rules', tables.includes('approval_rules'));
      this.registerFeature('transfers', tables.includes('transfer_approvals'));
      
      // Check for additional features
      this.registerFeature('notifications', tables.includes('notifications'));
      this.registerFeature('compliance', tables.includes('compliance_api'));
      this.registerFeature('custody', tables.includes('custody_vault'));
      
      console.log('📋 Detected features:', Array.from(this.featureRegistry.keys()));
    } catch (error) {
      console.error('⚠️ Error detecting features:', error);
    }
  }

  // Register a feature as available
  registerFeature(featureName, isAvailable) {
    this.featureRegistry.set(featureName, isAvailable);
  }

  // Get available database tables
  async getAvailableTables() {
    try {
      const result = await db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `).all();
      
      return result.map(row => row.name);
    } catch (error) {
      console.error('Error getting tables:', error);
      return [];
    }
  }

  // Generate and load banks
  async generateAndLoadBanks(count = 15) {
    console.log(`🏦 Generating ${count} banks...`);
    
    const bankProfiles = this.dataGenerator.generateBankProfiles(count);
    
    for (const bankProfile of bankProfiles) {
      try {
        // Generate API credentials
        const apiKey = this.generateApiKey();
        const apiSecret = this.generateApiSecret();
        
        const bankData = {
          ...bankProfile,
          api_key: apiKey,
          api_secret: apiSecret,
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        // Insert bank
        const stmt = db.prepare(`
          INSERT INTO banks (bank_name, bank_code, api_key, api_secret, contact_email, country, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
          bankData.bank_name,
          bankData.bank_code,
          bankData.api_key,
          bankData.api_secret,
          bankData.contact_email,
          bankData.country,
          bankData.status,
          bankData.created_at
        );
        
        bankData.id = result.lastInsertRowid;
        this.generatedData.banks.push(bankData);
        
        console.log(`✅ Created bank: ${bankData.bank_name} (${bankData.country})`);
      } catch (error) {
        console.error(`❌ Error creating bank ${bankProfile.bank_name}:`, error);
      }
    }
  }

  // Generate and load users
  async generateAndLoadUsers() {
    console.log('👥 Generating users for all banks...');
    
    const users = await this.dataGenerator.generateUsersForBanks(this.generatedData.banks);
    
    for (const userData of users) {
      try {
        const stmt = db.prepare(`
          INSERT INTO bank_users (user_id, bank_id, username, email, full_name, role, department, employee_id, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const userId = this.generateUserId();
        const username = userData.email.split('@')[0];
        const fullName = `${userData.first_name} ${userData.last_name}`;
        
        const result = stmt.run(
          userId,
          userData.bank_id,
          username,
          userData.email,
          fullName,
          userData.role,
          userData.department,
          userData.employee_id,
          'active',
          new Date().toISOString()
        );
        
        userData.id = result.lastInsertRowid;
        userData.user_id = userId;
        this.generatedData.users.push(userData);
        
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }
  }

  // Generate and load wallets
  async generateAndLoadWallets() {
    console.log('💼 Generating wallets for all banks...');
    
    // First, create custody vaults for each bank
    const vaults = [];
    for (const bank of this.generatedData.banks) {
      try {
        const vaultStmt = db.prepare(`
          INSERT INTO custody_vault (vault_address, security_level, total_assets_value, insurance_coverage)
          VALUES (?, ?, ?, ?)
        `);
        
        const vaultAddress = `vault_${bank.bank_code}_${Date.now()}`;
        const securityLevel = bank.tier === 'tier1' ? 'high' : bank.tier === 'tier2' ? 'medium' : 'standard';
        const totalAssets = bank.assets_usd || 10000000;
        const insuranceCoverage = totalAssets * 0.8;
        
        const vaultResult = vaultStmt.run(
          vaultAddress,
          securityLevel,
          totalAssets,
          insuranceCoverage
        );
        
        vaults.push({
          id: vaultResult.lastInsertRowid,
          bank_id: bank.id,
          vault_address: vaultAddress,
          security_level: securityLevel,
          total_assets_value: totalAssets,
          insurance_coverage: insuranceCoverage
        });
        
      } catch (error) {
        console.error(`❌ Error creating vault for bank ${bank.bank_name}:`, error);
      }
    }
    
    // Now create FBO wallets for each vault
    for (const vault of vaults) {
      const walletTypes = ['main_treasury', 'fx_reserve', 'settlement', 'emergency'];
      
      for (const walletType of walletTypes) {
        try {
          const walletStmt = db.prepare(`
            INSERT INTO fbo_wallets (vault_id, wallet_address, balance, creation_date)
            VALUES (?, ?, ?, ?)
          `);
          
          const walletAddress = `wallet_${vault.vault_address}_${walletType}_${Date.now()}`;
          const balance = this.dataGenerator.generateWalletBalance('tier2', 'USD', walletType);
          
          const walletResult = walletStmt.run(
            vault.id,
            walletAddress,
            balance,
            new Date().toISOString()
          );
          
          this.generatedData.wallets.push({
            id: walletResult.lastInsertRowid,
            vault_id: vault.id,
            bank_id: vault.bank_id,
            wallet_address: walletAddress,
            balance: balance,
            wallet_type: walletType,
            currency: 'USD',
            creation_date: new Date().toISOString()
          });
          
        } catch (error) {
          console.error(`❌ Error creating wallet for vault ${vault.vault_address}:`, error);
        }
      }
    }
  }

  // Generate and load transactions
  async generateAndLoadTransactions(count = 200) {
    console.log(`💸 Generating ${count} transactions...`);
    
    // Create a logic box for stablecoin transactions
    let logicBoxId;
    try {
      const logicStmt = db.prepare(`
        INSERT INTO core_stablecoin_logic_box (stablecoin_name, blockchain_network, smart_contract_address, total_supply)
        VALUES (?, ?, ?, ?)
      `);
      
      const logicResult = logicStmt.run(
        'Nexora USD',
        'Ethereum',
        '0x1234567890123456789012345678901234567890',
        1000000000.00
      );
      
      logicBoxId = logicResult.lastInsertRowid;
    } catch (error) {
      console.error('❌ Error creating logic box:', error);
      return;
    }
    
    const transactions = await this.dataGenerator.generateTransactions(
      this.generatedData.banks,
      this.generatedData.wallets,
      this.generatedData.users,
      count
    );
    
    for (const transactionData of transactions) {
      try {
        const stmt = db.prepare(`
          INSERT INTO transaction_records (
            logic_id, transaction_hash, amount, timestamp, status, initiated_by,
            approval_status, required_approvals, current_approvals, approval_deadline
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        const initiatedBy = this.generatedData.users.find(u => u.bank_id === transactionData.source_bank_id)?.user_id || 'system';
        const requiredApprovals = transactionData.amount > 100000 ? 2 : transactionData.amount > 10000 ? 1 : 0;
        const currentApprovals = Math.floor(Math.random() * (requiredApprovals + 1));
        const approvalDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        const result = stmt.run(
          logicBoxId,
          transactionHash,
          transactionData.amount,
          transactionData.created_at,
          transactionData.status,
          initiatedBy,
          requiredApprovals > 0 ? 'pending' : 'auto_approved',
          requiredApprovals,
          currentApprovals,
          approvalDeadline
        );
        
        transactionData.id = result.lastInsertRowid;
        transactionData.transaction_hash = transactionHash;
        this.generatedData.transactions.push(transactionData);
        
      } catch (error) {
        console.error(`❌ Error creating transaction ${transactionData.reference}:`, error);
      }
    }
  }

  // Generate and load roles and approval rules
  async generateAndLoadRolesAndApprovals() {
    console.log('🔐 Generating roles and approval rules...');
    
    for (const bank of this.generatedData.banks) {
      try {
        // Create default roles for each bank
        const roles = [
          { name: 'Viewer', level: 1, permissions: 'read_only' },
          { name: 'Operator', level: 5, permissions: 'transfers,reports' },
          { name: 'Manager', level: 7, permissions: 'transfers,approvals,reports' },
          { name: 'Admin', level: 10, permissions: 'all' }
        ];
        
        for (const role of roles) {
          const roleStmt = db.prepare(`
            INSERT INTO roles (bank_id, role_name, role_level, permissions, max_transfer_amount, can_approve_transfers, can_create_users, can_modify_settings)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const maxTransferAmount = role.level >= 7 ? 1000000 : role.level >= 5 ? 100000 : 10000;
          const canApprove = role.level >= 7;
          const canCreateUsers = role.level >= 10;
          const canModifySettings = role.level >= 10;
          
          const roleResult = roleStmt.run(
            bank.id,
            role.name,
            role.level,
            role.permissions,
            maxTransferAmount,
            canApprove ? 1 : 0,
            canCreateUsers ? 1 : 0,
            canModifySettings ? 1 : 0
          );
          
          this.generatedData.roles.push({
            id: roleResult.lastInsertRowid,
            bank_id: bank.id,
            ...role
          });
        }
        
        // Create approval rules for each bank
        const approvalRules = [
          { name: 'Small Transfers', min_amount: 0, max_amount: 9999, required_role_level: 1, required_approvals: 0, auto_approve: true },
          { name: 'Medium Transfers', min_amount: 10000, max_amount: 49999, required_role_level: 5, required_approvals: 1, auto_approve: false },
          { name: 'Large Transfers', min_amount: 50000, max_amount: 249999, required_role_level: 7, required_approvals: 1, auto_approve: false },
          { name: 'Very Large Transfers', min_amount: 250000, max_amount: null, required_role_level: 10, required_approvals: 2, auto_approve: false }
        ];
        
        for (const rule of approvalRules) {
          const ruleStmt = db.prepare(`
            INSERT INTO approval_rules (bank_id, rule_name, min_amount, max_amount, required_role_level, required_approvals, auto_approve)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
          
          const ruleResult = ruleStmt.run(
            bank.id,
            rule.name,
            rule.min_amount,
            rule.max_amount,
            rule.required_role_level,
            rule.required_approvals,
            rule.auto_approve ? 1 : 0
          );
          
          this.generatedData.approvalRules.push({
            id: ruleResult.lastInsertRowid,
            bank_id: bank.id,
            ...rule
          });
        }
        
        console.log(`✅ Created roles and approval rules for ${bank.bank_name}`);
        
      } catch (error) {
        console.error(`❌ Error creating roles for ${bank.bank_name}:`, error);
      }
    }
  }

  // Validate all generated data
  async validateGeneratedData() {
    console.log('🔍 Validating generated data...');
    
    const validationResults = {
      banks: await this.validateBanks(),
      users: await this.validateUsers(),
      wallets: await this.validateWallets(),
      transactions: await this.validateTransactions(),
      roles: await this.validateRoles(),
      approvalRules: await this.validateApprovalRules()
    };
    
    const allValid = Object.values(validationResults).every(result => result.valid);
    
    if (allValid) {
      console.log('✅ All data validation passed!');
    } else {
      console.error('❌ Data validation failed:');
      Object.entries(validationResults).forEach(([type, result]) => {
        if (!result.valid) {
          console.error(`  - ${type}: ${result.errors.join(', ')}`);
        }
      });
    }
    
    return validationResults;
  }

  // Validate banks
  async validateBanks() {
    const errors = [];
    
    for (const bank of this.generatedData.banks) {
      if (!bank.api_key || bank.api_key.length < 10) {
        errors.push(`Invalid API key for ${bank.bank_name}`);
      }
      if (!bank.country || !['MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'DO', 'CO'].includes(bank.country)) {
        errors.push(`Invalid country for ${bank.bank_name}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate users
  async validateUsers() {
    const errors = [];
    
    for (const user of this.generatedData.users) {
      if (!user.email || !user.email.includes('@')) {
        errors.push(`Invalid email for user ${user.first_name} ${user.last_name}`);
      }
      if (!['viewer', 'operator', 'manager', 'admin'].includes(user.role)) {
        errors.push(`Invalid role for user ${user.first_name} ${user.last_name}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate wallets
  async validateWallets() {
    const errors = [];
    
    for (const wallet of this.generatedData.wallets) {
      if (!wallet.currency || !this.dataGenerator.currencies.includes(wallet.currency)) {
        errors.push(`Invalid currency for wallet ${wallet.wallet_name}`);
      }
      if (wallet.balance < 0) {
        errors.push(`Negative balance for wallet ${wallet.wallet_name}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate transactions
  async validateTransactions() {
    const errors = [];
    
    for (const transaction of this.generatedData.transactions) {
      if (!this.dataGenerator.transactionTypes.includes(transaction.transaction_type)) {
        errors.push(`Invalid transaction type: ${transaction.transaction_type}`);
      }
      if (transaction.amount <= 0) {
        errors.push(`Invalid amount for transaction ${transaction.reference}`);
      }
      if (!['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(transaction.status)) {
        errors.push(`Invalid status for transaction ${transaction.reference}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate roles
  async validateRoles() {
    const errors = [];
    
    for (const role of this.generatedData.roles) {
      if (role.role_level < 1 || role.role_level > 10) {
        errors.push(`Invalid role level for ${role.role_name}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate approval rules
  async validateApprovalRules() {
    const errors = [];
    
    for (const rule of this.generatedData.approvalRules) {
      if (rule.min_amount < 0) {
        errors.push(`Invalid min amount for rule ${rule.rule_name}`);
      }
      if (rule.max_amount && rule.max_amount <= rule.min_amount) {
        errors.push(`Invalid amount range for rule ${rule.rule_name}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Print data summary
  printDataSummary() {
    console.log('\n📊 Generated Data Summary:');
    console.log(`🏦 Banks: ${this.generatedData.banks.length}`);
    console.log(`👥 Users: ${this.generatedData.users.length}`);
    console.log(`💼 Wallets: ${this.generatedData.wallets.length}`);
    console.log(`💸 Transactions: ${this.generatedData.transactions.length}`);
    console.log(`🔐 Roles: ${this.generatedData.roles.length}`);
    console.log(`📋 Approval Rules: ${this.generatedData.approvalRules.length}`);
    
    // Country breakdown
    const countryBreakdown = {};
    this.generatedData.banks.forEach(bank => {
      countryBreakdown[bank.country] = (countryBreakdown[bank.country] || 0) + 1;
    });
    
    console.log('\n🌍 Banks by Country:');
    Object.entries(countryBreakdown).forEach(([country, count]) => {
      console.log(`  ${country}: ${count} banks`);
    });
    
    // Transaction type breakdown
    const transactionTypeBreakdown = {};
    this.generatedData.transactions.forEach(tx => {
      transactionTypeBreakdown[tx.transaction_type] = (transactionTypeBreakdown[tx.transaction_type] || 0) + 1;
    });
    
    console.log('\n💸 Transactions by Type:');
    Object.entries(transactionTypeBreakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} transactions`);
    });
  }

  // Utility methods for ID generation
  generateApiKey() {
    return 'sk_' + Math.random().toString(36).substr(2, 32);
  }

  generateApiSecret() {
    return 'secret_' + Math.random().toString(36).substr(2, 32);
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 16);
  }

  generateWalletId() {
    return 'wallet_' + Math.random().toString(36).substr(2, 16);
  }

  generateTransactionId() {
    return 'txn_' + Math.random().toString(36).substr(2, 16);
  }

  // Clear all test data
  async clearAllTestData() {
    console.log('🧹 Clearing all test data...');
    
    try {
      const tables = ['transaction_records', 'transfer_approvals', 'fbo_wallets', 'bank_users', 'approval_rules', 'roles', 'banks'];
      
      for (const table of tables) {
        await db.prepare(`DELETE FROM ${table}`).run();
        console.log(`✅ Cleared ${table}`);
      }
      
      this.generatedData = {
        banks: [],
        users: [],
        wallets: [],
        transactions: [],
        roles: [],
        approvalRules: []
      };
      
      console.log('✅ All test data cleared!');
    } catch (error) {
      console.error('❌ Error clearing test data:', error);
      throw error;
    }
  }
}

module.exports = TestDataLoader; 