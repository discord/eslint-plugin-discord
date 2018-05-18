'use strict';

const rule = require('../../../lib/rules/react-import-style');

module.exports = ruleTester =>
  ruleTester.run('react-import-style', rule, {
    valid: [
      `
/* @flow */
import * as React from 'react';`,
      `import A from 'A';`,
    ],

    invalid: [
      {
        code: `import React from 'react';`,
        errors: [{messageId: 'improperReactImport'}],
      },
    ],
  });
