"use strict";

const rule = require("../../../lib/rules/explicit-createref-type");
const parser = require.resolve("babel-eslint");

module.exports = ruleTester =>
  ruleTester.run("explicit-createref-type", rule, {
    valid: [
      {
        parser,
        code: `
/* @flow */

import * as React from 'react';

class Test {
  a: {current: React.ElementRef<*> | null} = React.createRef();
  b: * = React.createRef();
  c = React.createElement();
  d = {};
}
`
      },
      {
        parser,
        code: `
/* @flow */

import * as React from 'react';

class Test {
  a = React.createRef<*>();
}
`
      }
    ],

    invalid: [
      {
        parser,
        code: `
/* @flow */
import * as React from 'react';
class Test { a = React.createRef(); }
`,
        errors: [{ messageId: "explicitCreateRefTypeMessage" }]
      }
    ]
  });
