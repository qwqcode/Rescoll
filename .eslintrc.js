module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error'
  },
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'jquery': true
  },
}