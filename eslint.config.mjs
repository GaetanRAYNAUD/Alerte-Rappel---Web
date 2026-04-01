// @ts-check
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat }                         from '@eslint/eslintrc';
import js                                     from '@eslint/js';
import stylistic                              from '@stylistic/eslint-plugin';
import typescriptEslint                       from '@typescript-eslint/eslint-plugin';
import _import                                from 'eslint-plugin-import';
import unusedImports                          from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores }        from 'eslint/config';
import globals                                from 'globals';
import path                                   from 'node:path';
import { fileURLToPath }                      from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig(
  globalIgnores([
    'build/**/*', 'dist/**/*', 'src/common/dto/mui.dto.ts'
  ]), {
    extends: fixupConfigRules(compat.extends('eslint:recommended',
      'plugin:@typescript-eslint/recommended')),
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // Groups Alphabetical order for imports
      'import/order': ['warn', {
        groups: [['builtin', 'external', 'internal'], ['sibling', 'parent', 'index']],
        'newlines-between': 'always',

        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }],

      '@stylistic/max-len': ['warn', {
        code: 135,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true
      }],

      'unused-imports/no-unused-imports': 'error',
      '@stylistic/indent': ['error', 2, {
        'SwitchCase': 1
      }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      'brace-style': ['error', '1tbs'],
      'no-trailing-spaces': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'object-curly-spacing': ['error', 'always'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      "prefer-const": [
        "warn",
        {
          "destructuring": "all",
        }
      ]
    }
  },
);
