module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(js|jsx)?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ], // finds test
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  modulePaths: [
    '/home/louis/Dev/FootyStats/client/src',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: [
    'react-app-polyfill/jsdom',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
  ],
};
