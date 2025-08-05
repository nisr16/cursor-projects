/**
 * Global Test Teardown
 * Runs after all tests to clean up the test environment
 */

module.exports = async () => {
    console.log('🧹 Cleaning up test environment...');
    
    // Clean up test database if needed
    if (process.env.TEST_DB_CLEANUP === 'true') {
        console.log('📊 Cleaning up test database...');
        // Add test database cleanup logic here if needed
    }
    
    // Log test summary
    if (global.__TEST_CONFIG__) {
        const endTime = new Date();
        const duration = endTime - global.__TEST_CONFIG__.startTime;
        console.log(`⏱️  Total test duration: ${duration}ms`);
    }
    
    // Clear global test configuration
    delete global.__TEST_CONFIG__;
    
    console.log('✅ Test environment cleanup complete');
}; 