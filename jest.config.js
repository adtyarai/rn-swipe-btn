module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  // Reanimated and Gesture Handler ship untranspiled sources that Jest must transform.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-gesture-handler)/)',
  ],
};
