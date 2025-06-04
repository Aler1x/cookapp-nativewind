import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset: 'jest-expo',
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testMatch: [
      '**/__tests__/**/*.(ts|tsx|js)',
      '**/*.(test|spec).(ts|tsx|js)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['babel-preset-expo'] }]
    },
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@rn-primitives|@react-navigation|@clerk)'
    ],
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/$1'
    },
    collectCoverageFrom: [
      '**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/node_modules/**',
      '!**/__tests__/**',
      '!**/coverage/**',
      '!babel.config.js',
      '!metro.config.js',
      '!jest.config.js'
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  };
};