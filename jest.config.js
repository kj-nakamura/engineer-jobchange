const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js アプリのディレクトリパスを指定
  dir: './',
})

// Jest の追加設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // エイリアスがある場合のパスマッピング
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
}

// createJestConfig は Next.js の設定を含む Jest 設定を作成する非同期関数
module.exports = createJestConfig(customJestConfig)