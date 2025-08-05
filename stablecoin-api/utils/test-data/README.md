# Nexora Test Data System - Central America + Caribbean Banking

A comprehensive automatic test data generation system for the Nexora banking API, specifically designed for Central American and Caribbean banking operations.

## 🌍 Supported Countries

The system supports all Central American countries and key Caribbean nations:

- 🇲🇽 **Mexico (MX)** - Major banking hub
- 🇬🇹 **Guatemala (GT)** - Central American banking
- 🇧🇿 **Belize (BZ)** - Financial services hub
- 🇸🇻 **El Salvador (SV)** - High remittance activity
- 🇭🇳 **Honduras (HN)** - Regional banking
- 🇳🇮 **Nicaragua (NI)** - Central American banking
- 🇨🇷 **Costa Rica (CR)** - Stable banking sector
- 🇵🇦 **Panama (PA)** - Financial hub
- 🇩🇴 **Dominican Republic (DO)** - High remittance activity
- 🇨🇴 **Colombia (CO)** - Andean banking

## 🚀 Features

### ✅ **Realistic Data Generation**
- **Bank Profiles**: Realistic bank names, codes, licensing, and regulatory compliance
- **User Management**: Multi-role users with proper permissions and departments
- **Wallet System**: Multi-currency wallets with proper balance management
- **Transaction Patterns**: Regional transaction patterns with realistic amounts and types
- **Role-Based Access**: Comprehensive role system with approval workflows
- **Compliance Data**: Regulatory reporting, AML checks, and sanctions screening

### ✅ **Automatic Feature Detection**
- Automatically detects available database tables
- Generates appropriate test data based on system capabilities
- Supports new features without code changes

### ✅ **Comprehensive Validation**
- Validates all generated data for accuracy and realism
- Cross-entity relationship validation
- Regional pattern validation
- Compliance data validation

### ✅ **CLI Interface**
- Easy-to-use command line interface
- Configurable data generation parameters
- Export functionality for data analysis
- Clear progress reporting

## 📁 File Structure

```
utils/test-data/
├── TransactionDataGenerator.js    # Core data generation logic
├── TestDataLoader.js             # Database loading and feature detection
├── TestDataValidator.js          # Comprehensive validation system
├── run-test-data.js              # CLI interface
├── README.md                     # This documentation
└── exports/                      # Generated data exports
    ├── complete-test-data.json
    ├── sample-data.json
    └── working-test-data.json
```

## 🛠️ Usage

### Basic Usage

```bash
# Generate default test data (15 banks, 200 transactions)
node utils/test-data/run-test-data.js

# Generate custom amounts
node utils/test-data/run-test-data.js --banks 10 --transactions 100

# Clear existing test data
node utils/test-data/run-test-data.js --clear

# Export data to JSON file
node utils/test-data/run-test-data.js --export my-data.json

# Show help
node utils/test-data/run-test-data.js --help
```

### Command Line Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--banks` | `-b` | Number of banks to generate | 15 |
| `--transactions` | `-t` | Number of transactions to generate | 200 |
| `--clear` | `-c` | Clear all existing test data | false |
| `--export` | `-e` | Export data to JSON file | none |
| `--help` | `-h` | Show help message | false |

## 📊 Generated Data Types

### 🏦 **Banks**
- Realistic bank names from the region
- Proper API credentials and licensing
- Country-specific regulatory compliance
- Tier-based classification (tier1, tier2, tier3)

### 👥 **Users**
- Multi-role users (viewer, operator, manager, admin)
- Realistic names from Central American countries
- Proper email addresses and contact information
- Department assignments (treasury, compliance, operations, etc.)

### 💼 **Wallets & Vaults**
- Custody vaults with security levels
- FBO (For Benefit Of) wallets
- Multi-currency support (USD, EUR, local currencies)
- Proper balance management and limits

### 💸 **Transactions**
- Regional transaction patterns
- Cross-border remittance flows
- Trade finance operations
- Compliance and regulatory reporting
- Realistic amounts and fees

### 🔐 **Roles & Permissions**
- Role-based access control
- Approval workflows
- Transfer limits by role
- User creation and modification permissions

### 📋 **Approval Rules**
- Amount-based approval rules
- Multi-level approval workflows
- Auto-approval for small amounts
- Regulatory compliance rules

## 🌍 Regional Patterns

### **High Remittance Countries**
- **El Salvador**: 50% cross-border transaction rate
- **Honduras**: 45% cross-border transaction rate
- **Dominican Republic**: 45% cross-border transaction rate

### **Financial Hub Countries**
- **Panama**: Trade finance and FX operations
- **Belize**: Financial services and international banking

### **Currency Support**
- **USD**: Universal support (El Salvador uses USD)
- **Local Currencies**: GTQ, HNL, CRC, PAB, DOP, NIO, BZD
- **Major Currencies**: EUR, MXN, COP

## 🔒 Compliance Features

### **Regulatory Reporting**
- High-value transaction monitoring (>$10,000)
- Cross-border payment reporting
- Regional transaction tracking

### **AML & KYC**
- Anti-money laundering checks
- Sanctions screening for cross-border transactions
- Compliance scoring system

### **Risk Management**
- Risk level assessment (low, medium, high)
- Processing time calculations
- Approval workflow management

## 📈 Data Validation

The system includes comprehensive validation for:

- **Data Integrity**: Required fields, data types, relationships
- **Business Logic**: Realistic amounts, proper workflows
- **Regional Patterns**: Country-specific transaction patterns
- **Compliance Rules**: Regulatory reporting requirements
- **Cross-Entity Relationships**: Proper foreign key relationships

## 🎯 Example Output

```bash
🚀 Starting comprehensive test data generation...
🔍 Detecting system features...
📋 Detected features: [banks, users, wallets, transactions, roles, approval_rules, transfers, notifications, compliance, custody]
🏦 Generating 5 banks...
✅ Created bank: Banco Regional LATAM (MX)
✅ Created bank: Central Banking Corp (GT)
✅ Created bank: Pacific Financial (BZ)
✅ Created bank: Caribbean Trade Bank (SV)
✅ Created bank: Andean Commercial Bank (HN)
👥 Generating users for all banks...
💼 Generating wallets for all banks...
💸 Generating 20 transactions...
🔐 Generating roles and approval rules...
✅ All data validation passed!
✅ All test data generated and loaded successfully!

📊 Generated Data Summary:
🏦 Banks: 5
👥 Users: 45
💼 Wallets: 20
💸 Transactions: 20
🔐 Roles: 20
📋 Approval Rules: 20
```

## 🔧 Technical Details

### **Database Schema Compatibility**
- Compatible with existing Nexora database schema
- Automatic table detection and feature registration
- Proper foreign key relationships

### **Data Realism**
- Realistic bank names from the region
- Proper phone number formats by country
- Address generation with country-specific patterns
- Realistic transaction amounts and patterns

### **Performance**
- Efficient batch processing
- Memory-optimized data generation
- Fast validation and export

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   node server.js
   ```

3. **Generate Test Data**
   ```bash
   node utils/test-data/run-test-data.js --banks 5 --transactions 50
   ```

4. **Export Data**
   ```bash
   node utils/test-data/run-test-data.js --export my-test-data.json
   ```

## 📝 Contributing

When adding new features:

1. **Update TransactionDataGenerator.js** for new data types
2. **Update TestDataLoader.js** for database integration
3. **Update TestDataValidator.js** for validation rules
4. **Update this README** for documentation

## 📄 License

This test data system is part of the Nexora banking API project.

---

**🎉 Ready for Production Use!**

The complete automatic test data system is now ready for comprehensive testing of the Nexora banking API across all Central American and Caribbean countries. 