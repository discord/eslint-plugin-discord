'use strict';

const rule = require('../../../lib/rules/use-a11y-component');

const onClick = `onClick={()=>{}}`;

module.exports = ruleTester =>
  ruleTester.run('use-a11y-component', rule, {
    valid: [`<Anchor href="#" ${onClick}>A</Anchor>`, `<button ${onClick}>A</button>`],

    invalid: [
      {
        code: `<a href="#">A</a>`,
        errors: [{messageId: 'useAnchorMessage'}],
      },
      {
        code: `<div onClick={()=>{}}>click</div>`,
        errors: [{messageId: 'useClickableMessage'}],
      },
    ],
  });
