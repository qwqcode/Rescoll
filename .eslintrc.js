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
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'camelcase': 'off'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true
  }
}
