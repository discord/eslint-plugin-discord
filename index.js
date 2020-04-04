module.exports = {
  rules: {
    'react-import-style': require('./lib/rules/react-import-style'),
    'use-a11y-component': require('./lib/rules/use-a11y-component'),
    camelcase: require('./lib/rules/camelcase-deprecation-support'),
    'explicit-createref-type': require('./lib/rules/explicit-createref-type'),
    'store-connect-deps': require('./lib/rules/store-connect-deps'),
  },
};
