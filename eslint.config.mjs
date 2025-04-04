import config from '@rocketseat/eslint-config/react.mjs'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  ...config,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      camelcase: 'off',

    },
  },
]
