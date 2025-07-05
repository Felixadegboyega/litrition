module.exports = function (api) {
  api.cache(true);
  return {
    // presets: ['babel-preset-expo'],
    plugins: [
      // 'nativewind/babel',
      'react-native-reanimated/plugin',
      'expo-router/babel'
    ],
    presets: [
      ["babel-preset-expo", {jsxImportSource: "nativewind"}],
      "nativewind/babel",
    ]
  };
};