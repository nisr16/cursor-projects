/**
 * Global Test Setup
 * Runs before all tests to configure the test environment
 */

module.exports = async () => {
    console.log('🧪 Setting up test environment...');
    
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.TEST_MODE = 'true';
    process.env.DB_CONNECTION = 'test';
    
    // Configure test database if needed
    if (process.env.TEST_DB_SETUP === 'true') {
        console.log('📊 Setting up test database...');
        // Add test database setup logic here if needed
    }
    
    // Set up global test configuration
    global.__TEST_CONFIG__ = {
        startTime: new Date(),
        testCount: 0,
        setupComplete: true
    };
    
    console.log('✅ Test environment setup complete');
}; 