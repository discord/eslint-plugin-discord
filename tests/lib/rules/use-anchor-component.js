'use strict';

const rule = require('../../../lib/rules/use-anchor-component');

module.exports = ruleTester =>
  ruleTester.run('use-anchor-component', rule, {
    valid: [`<Anchor href="#">A</Anchor>`, `<span>A</span>`],

    invalid: [
      {
        code: `<a href="#">A</a>`,
        errors: [{messageId: 'badElementUsage'}],
      },
    ],
  });
