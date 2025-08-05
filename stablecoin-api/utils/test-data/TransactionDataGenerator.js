// Nexora Test Transaction Data Generator - Complete Central America + Caribbean
// Generates realistic banking transaction data for all Central American countries

class TransactionDataGenerator {
  constructor() {
    // Updated to include all regional currencies
    this.currencies = [
      'USD', 'EUR', 'MXN', 'COP', 'GTQ', 'CRC', 'PAB', 'HNL', 
      'BZD', 'DOP', 'NIO' // Added Belize Dollar, Dominican Peso, Nicaraguan Córdoba
    ];
    this.transactionTypes = [
      'INTERBANK_TRANSFER',
      'CROSS_BORDER_PAYMENT', 
      'LIQUIDITY_REBALANCING',
      'FX_CONVERSION',
      'MERCHANT_SETTLEMENT',
      'REMITTANCE',
      'TRADE_FINANCE',
      'EMERGENCY_TRANSFER'
    ];
  }

  // Generate realistic bank profiles for all Central America + Caribbean
  generateBankProfiles(count = 15) {
    const bankNames = [
      // Regional banks
      'Banco Regional LATAM', 'Central Banking Corp', 'Pacific Financial',
      'Caribbean Trade Bank', 'Andean Commercial Bank', 'Metro Banking Group',
      'Continental Finance', 'Southern Banking Alliance', 'Digital Banking Co',
      'International Trade Bank', 'Azteca Financial Group', 'Maya Banking Corp',
      
      // Honduras banks
      'Banco Atlántida Honduras', 'Ficohsa Honduras', 'Banco de Occidente Honduras',
      'BAC Honduras', 'Banco Davivienda Honduras', 'Banco Promerica Honduras',
      
      // El Salvador banks
      'Banco Agrícola El Salvador', 'Banco Cuscatlán', 'Banco de América Central',
      'Banco Davivienda El Salvador', 'Banco ProCredit El Salvador', 'Banco Azteca El Salvador',
      
      // Guatemala banks
      'Banco Industrial Guatemala', 'Banco G&T Continental', 'Banco de Desarrollo Rural',
      'Banrural Guatemala', 'Banco BAM Guatemala', 'Banco Promerica Guatemala',
      
      // Belize banks
      'Belize Bank Limited', 'Heritage Bank Belize', 'Atlantic Bank Belize',
      'Caye International Bank', 'First Caribbean International Bank Belize',
      
      // Dominican Republic banks
      'Banco Popular Dominicano', 'Banco de Reservas', 'Banco BHD León',
      'Banco Santa Cruz', 'Banco Caribe', 'Scotiabank República Dominicana',
      'Citibank República Dominicana', 'Banco Promerica República Dominicana',
      
      // Costa Rica banks
      'Banco Nacional de Costa Rica', 'Banco de Costa Rica', 'BAC San José',
      'Banco Popular y de Desarrollo Comunal', 'Scotiabank Costa Rica',
      
      // Panama banks
      'Banco Nacional de Panamá', 'Banistmo', 'Banco General',
      'Multibank Panamá', 'Global Bank Panamá', 'Credicorp Bank',
      
      // Nicaragua banks
      'Banco de la Producción BANPRO', 'Banco de Finanzas BDF', 'BAC Nicaragua',
      'Banco Avanz', 'Banco de Crédito Centroamericano'
    ];

    // Complete Central America + Caribbean countries
    const countries = ['MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'DO', 'CO'];
    
    const cities = {
      'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancún'],
      'GT': ['Guatemala City', 'Quetzaltenango', 'Escuintla', 'Mixco'],
      'BZ': ['Belize City', 'San Ignacio', 'Orange Walk', 'Dangriga'],
      'SV': ['San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango', 'Santa Tecla'],
      'HN': ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso'],
      'NI': ['Managua', 'León', 'Granada', 'Masaya', 'Chinandega'],
      'CR': ['San José', 'Cartago', 'Puntarenas', 'Alajuela', 'Heredia'],
      'PA': ['Panama City', 'Colón', 'David', 'Santiago', 'Chitré'],
      'DO': ['Santo Domingo', 'Santiago', 'Puerto Plata', 'San Pedro de Macorís', 'La Romana'],
      'CO': ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Barranquilla']
    };
    
    return Array.from({length: count}, (_, i) => ({
      bank_name: bankNames[i % bankNames.length],
      bank_code: `TB${String(Date.now() + i).padStart(3, '0')}`,
      country: countries[i % countries.length],
      contact_email: `admin@${bankNames[i % bankNames.length].toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com`,
      phone: this.generatePhone(countries[i % countries.length]),
      address: this.generateAddress(countries[i % countries.length], cities),
      tier: this.randomChoice(['tier1', 'tier2', 'tier3'], [0.2, 0.5, 0.3]),
      daily_volume: Math.floor(Math.random() * 100) + 20,
      assets_usd: this.generateAssetSize(),
      regulatory_license: this.generateLicenseNumber(countries[i % countries.length]),
      time_zone: this.getTimeZone(countries[i % countries.length])
    }));
  }

  // Generate realistic users with names from all countries
  async generateUsersForBanks(banks) {
    const roles = ['viewer', 'operator', 'manager', 'admin'];
    const departments = ['treasury', 'compliance', 'operations', 'finance', 'risk', 'audit'];
    
    const firstNames = [
      // Spanish names (most countries)
      'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Diego', 'Sofia',
      'Miguel', 'Elena', 'Fernando', 'Patricia', 'Roberto', 'Isabel', 'Antonio',
      'Lucía', 'Manuel', 'Cristina', 'Francisco', 'Beatriz', 'Rafael', 'Mónica',
      
      // Central American specific
      'Alejandro', 'Valeria', 'Jorge', 'Natalia', 'Andrés', 'Gabriela',
      'Marvin', 'Daysi', 'Edwin', 'Miriam', 'Santos', 'Rosa', 'Óscar', 'Silvia',
      'Salvador', 'Esperanza', 'Rigoberto', 'Marisol', 'Víctor', 'Claudia',
      
      // English names (Belize)
      'Michael', 'Sarah', 'David', 'Jennifer', 'Christopher', 'Michelle',
      'Anthony', 'Lisa', 'Mark', 'Angela', 'Steven', 'Maria',
      
      // Dominican specific
      'Ramón', 'Yolanda', 'Félix', 'Miguelina', 'Juan', 'Francisca',
      'Pedro', 'Carmen', 'Julio', 'Mercedes', 'Raúl', 'Esperanza'
    ];
    
    const lastNames = [
      // Spanish surnames
      'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Hernández',
      'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Torres', 'Flores', 'Gómez',
      'Jiménez', 'Ruiz', 'Morales', 'Ortega', 'Delgado', 'Castro', 'Vargas',
      
      // Central American specific
      'Zelaya', 'Valladares', 'Mejía', 'Aguilar', 'Villanueva', 'Reyes',
      'Rivas', 'Campos', 'Portillo', 'Meléndez', 'Quintanilla', 'Escalante',
      
      // English surnames (Belize)
      'Williams', 'Brown', 'Johnson', 'Jones', 'Smith', 'Davis',
      'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
      
      // Dominican specific
      'De la Cruz', 'Peña', 'Rosario', 'Medina', 'Guerrero', 'Núñez',
      'Paulino', 'Báez', 'De los Santos', 'Contreras'
    ];
    
    let users = [];
    
    banks.forEach(bank => {
      const userCount = bank.tier === 'tier1' ? 12 : bank.tier === 'tier2' ? 8 : 5;
      
      for (let i = 0; i < userCount; i++) {
        const firstName = this.randomChoice(firstNames);
        const lastName = this.randomChoice(lastNames);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@${bank.bank_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com`;
        
        users.push({
          bank_id: bank.id,
          email: email,
          password: 'TestPassword123!',
          first_name: firstName,
          last_name: lastName,
          role: this.randomChoice(roles, [0.35, 0.35, 0.20, 0.10]),
          department: this.randomChoice(departments),
          phone: this.generatePhone(bank.country),
          employee_id: `EMP${bank.bank_code}${String(i + 1).padStart(3, '0')}`,
          hire_date: this.randomDateInPast(1095),
          salary_usd: this.generateSalary(this.randomChoice(roles)),
          security_clearance: this.randomChoice(['basic', 'standard', 'high'], [0.5, 0.4, 0.1]),
          language_preference: this.getLanguagePreference(bank.country)
        });
      }
    });
    
    return users;
  }

  // Generate wallets with proper currency support for each country
  async generateWalletsForBanks(banks) {
    let wallets = [];
    
    banks.forEach(bank => {
      const walletTypes = [
        'main_treasury', 'fx_reserve', 'settlement', 'emergency',
        'correspondent', 'nostro', 'vostro', 'regulatory_reserve'
      ];
      
      walletTypes.forEach(type => {
        let currencies = this.getCurrenciesForCountry(bank.country, bank.tier);
          
        currencies.forEach(currency => {
          wallets.push({
            bank_id: bank.id,
            wallet_name: `${bank.bank_name} ${type.replace('_', ' ').toUpperCase()} - ${currency}`,
            currency: currency,
            wallet_type: type,
            balance: this.generateWalletBalance(bank.tier || 'tier2', currency, type),
            account_number: this.generateAccountNumber(bank.bank_code, currency, type),
            swift_code: this.generateSwiftCode(bank.country),
            iban: this.generateIBAN(bank.country),
            status: Math.random() > 0.05 ? 'active' : 'maintenance',
            daily_limit: this.generateDailyLimit(bank.tier, type),
            monthly_limit: this.generateMonthlyLimit(bank.tier, type)
          });
        });
      });
    });
    
    return wallets;
  }

  // Generate realistic transactions with complex patterns
  async generateTransactions(banks, wallets, users, count = 200) {
    let transactions = [];
    
    for (let i = 0; i < count; i++) {
      // Pick random source and destination banks (but favor certain patterns)
      const sourceBank = this.randomChoice(banks);
      let destBank;
      
      // Ensure sourceBank has required properties
      if (!sourceBank || !sourceBank.country) {
        continue;
      }
      
      // Cross-border transaction rates by country
      const crossBorderRates = {
        'SV': 0.50,  // El Salvador - highest remittance activity
        'HN': 0.45,  // Honduras
        'DO': 0.45,  // Dominican Republic - high remittances
        'GT': 0.40,  // Guatemala
        'NI': 0.40,  // Nicaragua
        'BZ': 0.35,  // Belize - financial services
        'PA': 0.35,  // Panama - financial hub
        'CR': 0.30,  // Costa Rica
        'MX': 0.25,  // Mexico
        'CO': 0.30   // Colombia
      };
      
      const crossBorderRate = crossBorderRates[sourceBank.country] || 0.30;
      
      if (Math.random() < (1 - crossBorderRate)) {
        const sameBanks = banks.filter(b => b.country === sourceBank.country && b.id !== sourceBank.id);
        destBank = sameBanks.length > 0 ? this.randomChoice(sameBanks) : this.randomChoice(banks.filter(b => b.id !== sourceBank.id));
      } else {
        // Favor regional trading partners for cross-border transactions
        const tradingPartners = this.getTradingPartners(sourceBank.country);
        const partnerBanks = banks.filter(b => tradingPartners.includes(b.country) && b.id !== sourceBank.id);
        destBank = partnerBanks.length > 0 ? this.randomChoice(partnerBanks) : this.randomChoice(banks.filter(b => b.country !== sourceBank.country));
      }
      
      if (!destBank) destBank = this.randomChoice(banks.filter(b => b.id !== sourceBank.id));
      
      // Get wallets for these banks
      const sourceWallets = wallets.filter(w => w.bank_id === sourceBank.id && w.status === 'active');
      const destWallets = wallets.filter(w => w.bank_id === destBank.id && w.status === 'active');
      
      if (sourceWallets.length === 0 || destWallets.length === 0) continue;
      
      const sourceWallet = this.randomChoice(sourceWallets);
      const destWallet = this.randomChoice(destWallets.filter(w => w.currency === sourceWallet.currency));
      
      if (!destWallet) continue;
      
      const transactionType = this.selectTransactionType(sourceBank, destBank, sourceWallet.wallet_type);
      const amount = this.generateTransactionAmount(transactionType, sourceBank.tier || 'tier2', sourceBank.country === destBank.country);
      
      const createdAt = this.generateBusinessDateTime(60);
      const status = this.determineTransactionStatus(amount, transactionType);
      const fees = this.calculateTransactionFees(amount, transactionType, sourceBank.country === destBank.country);
      
      transactions.push({
        source_wallet_id: sourceWallet.id,
        destination_wallet_id: destWallet.id,
        amount: amount,
        currency: sourceWallet.currency,
        transaction_type: transactionType,
        status: status,
        reference: this.generateReference(transactionType, sourceBank.bank_code),
        description: this.generateTransactionDescription(transactionType, sourceBank, destBank, amount),
        fees: fees,
        exchange_rate: this.getExchangeRate(sourceWallet.currency, destWallet.currency),
        sender_name: this.generatePersonName(sourceBank.country),
        receiver_name: this.generatePersonName(destBank.country),
        purpose_code: this.generatePurposeCode(transactionType),
        compliance_score: this.generateComplianceScore(),
        risk_level: this.determineRiskLevel(amount, sourceBank.country, destBank.country),
        processing_time_minutes: this.calculateProcessingTime(status, amount),
        created_at: createdAt,
        updated_at: status === 'completed' ? this.addMinutes(createdAt, this.calculateProcessingTime(status, amount)) : createdAt,
        regulatory_reporting: transactionType === 'CROSS_BORDER_PAYMENT' && amount > 10000,
        anti_money_laundering_check: amount > 50000,
        sanctions_screening: transactionType === 'CROSS_BORDER_PAYMENT',
        source_country: sourceBank.country,
        destination_country: destBank.country,
        is_regional: this.isRegionalTransaction(sourceBank.country, destBank.country)
      });
    }
    
    return transactions.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  // Utility methods for realistic data generation
  randomChoice(array, weights = null) {
    if (!weights) {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < array.length; i++) {
      random -= weights[i];
      if (random <= 0) return array[i];
    }
    
    return array[array.length - 1];
  }

  generatePhone(country) {
    const patterns = {
      'MX': '+52-55-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'GT': '+502-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 90000 + 10000),
      'BZ': '+501-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'SV': '+503-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'HN': '+504-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'NI': '+505-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 90000 + 10000),
      'CR': '+506-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'PA': '+507-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'DO': '+1-809-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000),
      'CO': '+57-1-' + Math.floor(Math.random() * 900 + 100) + '-' + Math.floor(Math.random() * 9000 + 1000)
    };
    return patterns[country] || '+1-555-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000);
  }

  generateAddress(country, cities) {
    const streetNumbers = Math.floor(Math.random() * 9999) + 1;
    const streets = ['Avenida Principal', 'Calle Central', 'Boulevard Financiero', 'Zona Bancaria', 'Centro Empresarial'];
    
    // Add country-specific street names
    const countryStreets = {
      'HN': ['Boulevard Morazán', 'Avenida Juan Pablo II', 'Colonia Palmira', 'Barrio Guanacaste'],
      'SV': ['Boulevard de los Héroes', 'Alameda Roosevelt', 'Colonia Escalón', 'Zona Rosa'],
      'BZ': ['Northern Highway', 'Western Highway', 'Queen Street', 'Albert Street'],
      'DO': ['Avenida 27 de Febrero', 'Malecón', 'Avenida Winston Churchill', 'Zona Colonial'],
      'GT': ['Zona Viva', 'Avenida La Reforma', 'Boulevard Los Próceres'],
      'NI': ['Carretera Masaya', 'Avenida Bolívar', 'Barrio Martha Quezada'],
      'CR': ['Paseo Colón', 'Avenida Central', 'Escazú Centro'],
      'PA': ['Vía España', 'Cinta Costera', 'Avenida Balboa']
    };
    
    if (countryStreets[country]) {
      streets.push(...countryStreets[country]);
    }
    
    const cityList = cities[country] || ['Capital City'];
    
    return `${streetNumbers} ${this.randomChoice(streets)}, ${this.randomChoice(cityList)}, ${country}`;
  }

  generateLicenseNumber(country) {
    const prefixes = {
      'MX': 'CNBV-',      // Mexico
      'GT': 'SIB-',       // Guatemala
      'BZ': 'CBB-',       // Central Bank of Belize
      'SV': 'SSF-',       // El Salvador
      'HN': 'CNBS-',      // Honduras
      'NI': 'SIBOIF-',    // Nicaragua
      'CR': 'SUGEF-',     // Costa Rica
      'PA': 'SBP-',       // Panama
      'DO': 'SIB-',       // Dominican Republic
      'CO': 'SFC-'        // Colombia
    };
    const prefix = prefixes[country] || 'REG-';
    return prefix + Math.floor(Math.random() * 900000 + 100000);
  }

  getCurrenciesForCountry(country, tier) {
    const countryCurrencies = {
      'MX': {
        tier1: ['USD', 'EUR', 'MXN', 'CAD'],
        tier2: ['USD', 'MXN', 'EUR'],
        tier3: ['USD', 'MXN']
      },
      'GT': {
        tier1: ['USD', 'EUR', 'GTQ', 'MXN'],
        tier2: ['USD', 'GTQ', 'MXN'],
        tier3: ['USD', 'GTQ']
      },
      'BZ': {
        tier1: ['USD', 'BZD', 'EUR', 'MXN'],
        tier2: ['USD', 'BZD', 'MXN'],
        tier3: ['USD', 'BZD']
      },
      'SV': {
        tier1: ['USD', 'EUR', 'MXN'],
        tier2: ['USD', 'MXN'],
        tier3: ['USD']
      },
      'HN': {
        tier1: ['USD', 'EUR', 'HNL', 'MXN'],
        tier2: ['USD', 'HNL', 'MXN'],
        tier3: ['USD', 'HNL']
      },
      'NI': {
        tier1: ['USD', 'EUR', 'NIO', 'MXN'],
        tier2: ['USD', 'NIO', 'MXN'],
        tier3: ['USD', 'NIO']
      },
      'CR': {
        tier1: ['USD', 'EUR', 'CRC', 'MXN'],
        tier2: ['USD', 'CRC', 'MXN'],
        tier3: ['USD', 'CRC']
      },
      'PA': {
        tier1: ['USD', 'PAB', 'EUR', 'MXN'],
        tier2: ['USD', 'PAB', 'MXN'],
        tier3: ['USD', 'PAB']
      },
      'DO': {
        tier1: ['USD', 'EUR', 'DOP', 'MXN'],
        tier2: ['USD', 'DOP', 'MXN'],
        tier3: ['USD', 'DOP']
      },
      'CO': {
        tier1: ['USD', 'EUR', 'COP', 'MXN'],
        tier2: ['USD', 'COP', 'MXN'],
        tier3: ['USD', 'COP']
      }
    };
    
    return countryCurrencies[country]?.[tier] || ['USD'];
  }

  getTimeZone(country) {
    const timeZones = {
      'MX': 'America/Mexico_City',
      'GT': 'America/Guatemala',
      'BZ': 'America/Belize',
      'SV': 'America/El_Salvador',
      'HN': 'America/Tegucigalpa',
      'NI': 'America/Managua',
      'CR': 'America/Costa_Rica',
      'PA': 'America/Panama',
      'DO': 'America/Santo_Domingo',
      'CO': 'America/Bogota'
    };
    return timeZones[country] || 'UTC';
  }

  getLanguagePreference(country) {
    if (country === 'BZ') return 'en'; // English for Belize
    return 'es'; // Spanish for all others
  }

  generateWalletBalance(tier, currency, walletType) {
    const multipliers = {
      tier1: { min: 2000000, max: 100000000 },
      tier2: { min: 500000, max: 20000000 },
      tier3: { min: 100000, max: 5000000 }
    };
    
    const typeMultipliers = {
      main_treasury: 1.0,
      fx_reserve: 0.6,
      settlement: 0.3,
      emergency: 0.1,
      correspondent: 0.4,
      nostro: 0.8,
      vostro: 0.5,
      regulatory_reserve: 0.2
    };
    
    const range = multipliers[tier];
    const baseAmount = Math.random() * (range.max - range.min) + range.min;
    const typeMultiplier = typeMultipliers[walletType] || 0.5;
    
    // Updated currency conversion rates
    const currencyMultipliers = {
      'USD': 1.0,
      'EUR': 0.9,
      'MXN': 18,
      'COP': 4000,
      'GTQ': 8,
      'CRC': 600,
      'PAB': 1.0,
      'HNL': 25,
      'BZD': 2.0,   // Belize Dollar (pegged 2:1 to USD)
      'DOP': 57,    // Dominican Peso
      'NIO': 36     // Nicaraguan Córdoba
    };
    
    return Math.floor(baseAmount * typeMultiplier * (currencyMultipliers[currency] || 1));
  }

  generateAccountNumber(bankCode, currency, walletType) {
    const typeCode = walletType.substring(0, 2).toUpperCase();
    const currencyCode = currency;
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${bankCode}-${currencyCode}-${typeCode}-${randomNumber}`;
  }

  generateSwiftCode(country) {
    const countryCodes = {
      'MX': 'MX', 'GT': 'GT', 'BZ': 'BZ', 'SV': 'SV', 'HN': 'HN',
      'NI': 'NI', 'CR': 'CR', 'PA': 'PA', 'DO': 'DO', 'CO': 'CO'
    };
    const bankCode = Math.random().toString(36).substr(2, 4).toUpperCase();
    return bankCode + countryCodes[country] + '2X';
  }

  generateIBAN(country) {
    // Countries that don't use IBAN
    const noIbanCountries = ['MX', 'CO', 'GT', 'BZ', 'HN', 'SV', 'NI', 'DO'];
    
    if (noIbanCountries.includes(country)) {
      return null;
    }
    
    const countryCode = country;
    const checkDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const accountNumber = Math.floor(Math.random() * 900000000000000000) + 100000000000000000;
    return countryCode + checkDigits + accountNumber;
  }

  getTradingPartners(country) {
    const partners = {
      'MX': ['US', 'GT', 'BZ'],
      'GT': ['MX', 'SV', 'HN', 'BZ'],
      'BZ': ['GT', 'MX', 'US'],
      'SV': ['GT', 'HN', 'US'],
      'HN': ['SV', 'GT', 'NI', 'US'],
      'NI': ['HN', 'CR', 'SV'],
      'CR': ['NI', 'PA', 'US'],
      'PA': ['CR', 'CO', 'US'],
      'DO': ['US', 'PR', 'VE'],
      'CO': ['PA', 'VE', 'EC', 'US']
    };
    return partners[country] || ['US'];
  }

  isRegionalTransaction(sourceCountry, destCountry) {
    const centralAmericaCaribbean = ['MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'DO', 'CO'];
    return centralAmericaCaribbean.includes(sourceCountry) && centralAmericaCaribbean.includes(destCountry);
  }

  selectTransactionType(sourceBank, destBank, walletType) {
    if (sourceBank.country !== destBank.country) {
      // High remittance countries
      const highRemittanceCountries = ['SV', 'HN', 'GT', 'DO', 'NI'];
      
      if (highRemittanceCountries.includes(sourceBank.country) || highRemittanceCountries.includes(destBank.country)) {
        return this.randomChoice(['REMITTANCE', 'CROSS_BORDER_PAYMENT'], [0.6, 0.4]);
      }
      
      // Financial hub countries
      const financialHubs = ['PA', 'BZ'];
      if (financialHubs.includes(sourceBank.country) || financialHubs.includes(destBank.country)) {
        return this.randomChoice(['TRADE_FINANCE', 'FX_CONVERSION', 'CROSS_BORDER_PAYMENT'], [0.4, 0.3, 0.3]);
      }
      
      return this.randomChoice(['CROSS_BORDER_PAYMENT', 'TRADE_FINANCE', 'FX_CONVERSION'], [0.5, 0.3, 0.2]);
    } else {
      // Domestic transactions
      return this.randomChoice(['INTERBANK_TRANSFER', 'LIQUIDITY_REBALANCING', 'MERCHANT_SETTLEMENT'], [0.5, 0.3, 0.2]);
    }
  }

  generateTransactionAmount(transactionType, tier, isDomestic) {
    const baseAmounts = {
      'REMITTANCE': { min: 100, max: 5000 },
      'CROSS_BORDER_PAYMENT': { min: 1000, max: 50000 },
      'TRADE_FINANCE': { min: 10000, max: 500000 },
      'FX_CONVERSION': { min: 5000, max: 100000 },
      'INTERBANK_TRANSFER': { min: 50000, max: 1000000 },
      'LIQUIDITY_REBALANCING': { min: 100000, max: 5000000 },
      'MERCHANT_SETTLEMENT': { min: 1000, max: 100000 },
      'EMERGENCY_TRANSFER': { min: 50000, max: 2000000 }
    };
    
    const range = baseAmounts[transactionType] || { min: 1000, max: 100000 };
    const tierMultiplier = tier === 'tier1' ? 2.0 : tier === 'tier2' ? 1.0 : 0.5;
    const domesticMultiplier = isDomestic ? 1.5 : 1.0;
    
    return Math.floor((Math.random() * (range.max - range.min) + range.min) * tierMultiplier * domesticMultiplier);
  }

  determineTransactionStatus(amount, transactionType) {
    const statuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    const weights = [0.1, 0.2, 0.65, 0.03, 0.02];
    
    // High-value transactions are more likely to be pending for approval
    if (amount > 100000) {
      return this.randomChoice(['pending', 'processing', 'completed'], [0.3, 0.2, 0.5]);
    }
    
    return this.randomChoice(statuses, weights);
  }

  calculateTransactionFees(amount, transactionType, isDomestic) {
    const feeRates = {
      'REMITTANCE': 0.025,      // 2.5%
      'CROSS_BORDER_PAYMENT': 0.015, // 1.5%
      'TRADE_FINANCE': 0.01,    // 1%
      'FX_CONVERSION': 0.02,    // 2%
      'INTERBANK_TRANSFER': 0.005, // 0.5%
      'LIQUIDITY_REBALANCING': 0.003, // 0.3%
      'MERCHANT_SETTLEMENT': 0.01, // 1%
      'EMERGENCY_TRANSFER': 0.03 // 3%
    };
    
    const baseRate = feeRates[transactionType] || 0.01;
    const domesticDiscount = isDomestic ? 0.5 : 1.0;
    
    return Math.floor(amount * baseRate * domesticDiscount);
  }

  generateReference(transactionType, bankCode) {
    const prefixes = {
      'REMITTANCE': 'REM',
      'CROSS_BORDER_PAYMENT': 'CBP',
      'TRADE_FINANCE': 'TRF',
      'FX_CONVERSION': 'FXC',
      'INTERBANK_TRANSFER': 'IBT',
      'LIQUIDITY_REBALANCING': 'LQR',
      'MERCHANT_SETTLEMENT': 'MST',
      'EMERGENCY_TRANSFER': 'EMG'
    };
    
    const prefix = prefixes[transactionType] || 'TXN';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${prefix}-${bankCode}-${timestamp}-${random}`;
  }

  generateTransactionDescription(transactionType, sourceBank, destBank, amount) {
    const descriptions = {
      'REMITTANCE': `Remittance from ${sourceBank.country} to ${destBank.country}`,
      'CROSS_BORDER_PAYMENT': `Cross-border payment: ${sourceBank.bank_name} to ${destBank.bank_name}`,
      'TRADE_FINANCE': `Trade finance transaction between ${sourceBank.country} and ${destBank.country}`,
      'FX_CONVERSION': `Foreign exchange conversion`,
      'INTERBANK_TRANSFER': `Interbank transfer within ${sourceBank.country}`,
      'LIQUIDITY_REBALANCING': `Liquidity rebalancing for ${sourceBank.bank_name}`,
      'MERCHANT_SETTLEMENT': `Merchant settlement payment`,
      'EMERGENCY_TRANSFER': `Emergency transfer - urgent processing required`
    };
    
    return descriptions[transactionType] || `Transaction: ${sourceBank.bank_name} to ${destBank.bank_name}`;
  }

  getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1.0;
    
    const rates = {
      'USD': { 'EUR': 0.9, 'MXN': 18, 'COP': 4000, 'GTQ': 8, 'CRC': 600, 'PAB': 1.0, 'HNL': 25, 'BZD': 2.0, 'DOP': 57, 'NIO': 36 },
      'EUR': { 'USD': 1.1, 'MXN': 20, 'COP': 4400, 'GTQ': 9, 'CRC': 660, 'PAB': 1.1, 'HNL': 28, 'BZD': 2.2, 'DOP': 63, 'NIO': 40 },
      'MXN': { 'USD': 0.056, 'EUR': 0.05, 'COP': 222, 'GTQ': 0.44, 'CRC': 33, 'PAB': 0.056, 'HNL': 1.4, 'BZD': 0.11, 'DOP': 3.2, 'NIO': 2.0 }
    };
    
    return rates[fromCurrency]?.[toCurrency] || 1.0;
  }

  generatePersonName(country) {
    const firstNames = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Diego', 'Sofia'];
    const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Hernández'];
    
    return `${this.randomChoice(firstNames)} ${this.randomChoice(lastNames)}`;
  }

  generatePurposeCode(transactionType) {
    const purposeCodes = {
      'REMITTANCE': 'A10',
      'CROSS_BORDER_PAYMENT': 'A20',
      'TRADE_FINANCE': 'A30',
      'FX_CONVERSION': 'A40',
      'INTERBANK_TRANSFER': 'A50',
      'LIQUIDITY_REBALANCING': 'A60',
      'MERCHANT_SETTLEMENT': 'A70',
      'EMERGENCY_TRANSFER': 'A80'
    };
    
    return purposeCodes[transactionType] || 'A00';
  }

  generateComplianceScore() {
    return Math.floor(Math.random() * 100) + 1;
  }

  determineRiskLevel(amount, sourceCountry, destCountry) {
    if (amount > 100000) return 'high';
    if (amount > 10000) return 'medium';
    return 'low';
  }

  calculateProcessingTime(status, amount) {
    if (status === 'completed') {
      if (amount > 100000) return Math.floor(Math.random() * 60) + 120; // 2-3 hours
      if (amount > 10000) return Math.floor(Math.random() * 30) + 30; // 30-60 minutes
      return Math.floor(Math.random() * 15) + 5; // 5-20 minutes
    }
    return 0;
  }

  generateBusinessDateTime(daysBack) {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
    
    // Ensure it's a business day (Monday-Friday)
    const dayOfWeek = pastDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      pastDate.setDate(pastDate.getDate() - (dayOfWeek === 0 ? 2 : 1));
    }
    
    // Set business hours (9 AM - 5 PM)
    const hour = Math.floor(Math.random() * 8) + 9;
    const minute = Math.floor(Math.random() * 60);
    
    pastDate.setHours(hour, minute, 0, 0);
    
    return pastDate.toISOString();
  }

  addMinutes(date, minutes) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate.toISOString();
  }

  randomDateInPast(days) {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (Math.random() * days * 24 * 60 * 60 * 1000));
    return pastDate.toISOString().split('T')[0];
  }

  generateAssetSize() {
    const sizes = [
      { min: 10000000, max: 100000000 },   // 10M - 100M
      { min: 100000000, max: 1000000000 }, // 100M - 1B
      { min: 1000000000, max: 10000000000 } // 1B - 10B
    ];
    
    const size = this.randomChoice(sizes);
    return Math.floor(Math.random() * (size.max - size.min) + size.min);
  }

  generateSalary(role) {
    const baseSalaries = {
      'viewer': { min: 30000, max: 50000 },
      'operator': { min: 45000, max: 75000 },
      'manager': { min: 70000, max: 120000 },
      'admin': { min: 90000, max: 150000 }
    };
    
    const range = baseSalaries[role] || { min: 40000, max: 60000 };
    return Math.floor(Math.random() * (range.max - range.min) + range.min);
  }

  generateDailyLimit(tier, walletType) {
    const baseLimits = {
      tier1: { min: 1000000, max: 10000000 },
      tier2: { min: 500000, max: 5000000 },
      tier3: { min: 100000, max: 1000000 }
    };
    
    const range = baseLimits[tier] || { min: 500000, max: 5000000 };
    const typeMultiplier = walletType === 'emergency' ? 2.0 : 1.0;
    
    return Math.floor((Math.random() * (range.max - range.min) + range.min) * typeMultiplier);
  }

  generateMonthlyLimit(tier, walletType) {
    return this.generateDailyLimit(tier, walletType) * 30;
  }
}

module.exports = TransactionDataGenerator; 