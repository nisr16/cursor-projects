/**
 * Jest Configuration for Analytics Testing
 * Configures Jest for testing the analytics system
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',
    
    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js',
        '**/src/**/*.test.js',
        '**/src/**/*.spec.js'
    ],
    
    // Coverage reporting
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/**/*.spec.js',
        '!src/**/test-*.js',
        '!src/**/example-*.js'
    ],
    
    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    
    // Coverage reporters
    coverageReporters: [
        'text',
        'lcov',
        'html'
    ],
    
    // Setup files
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup.js'
    ],
    
    // Module name mapping
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1'
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Verbose output
    verbose: true,
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Restore mocks between tests
    restoreMocks: true,
    
    // Reset modules between tests
    resetModules: true,
    
    // Test results processor
    testResultsProcessor: 'jest-sonar-reporter',
    
    // Coverage directory
    coverageDirectory: 'coverage',
    
    // Test path ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/'
    ],
    
    // Module file extensions
    moduleFileExtensions: [
        'js',
        'json'
    ],
    
    // Transform configuration
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    
    // Transform ignore patterns
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],
    
    // Watch plugins
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    
    // Notify mode
    notify: true,
    
    // Notify mode configuration
    notifyMode: 'failure-change',
    
    // Test location in error messages
    testLocationInResults: true,
    
    // Global setup and teardown
    globalSetup: '<rootDir>/tests/global-setup.js',
    globalTeardown: '<rootDir>/tests/global-teardown.js'
}; 