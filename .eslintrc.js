module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    serviceworker: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'dist/', 
    'build/', 
    'node_modules/', 
    '*.min.js',
    'src/assets/js/app.js',
    'generate-favicons.js',
    'public/sw.js'
  ],
}; 