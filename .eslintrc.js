module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true
  }
}
