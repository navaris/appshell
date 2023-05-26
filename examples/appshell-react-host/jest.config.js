module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|svg|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
};
