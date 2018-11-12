module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // reporters: ["jest-tap-reporter"],
  setupFiles: [
      "./test/setup.ts"
  ],
};