module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true
  }
}
