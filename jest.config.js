export default {
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'jsdom'
};
