'use strict';

const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const rules = [require('./rules/react-import-style'), require('./rules/use-anchor-component')];

rules.forEach(rule => rule(ruleTester));
