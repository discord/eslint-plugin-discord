'use strict';

const traverse = require('eslint-traverse');

const notStoreDep = 'Expected a store';
const missingStoreDeps = 'Missing stores {{stores}} that are used in callback';
const extraStoreDeps = 'Unused stores {{stores}} in stores array';

module.exports = {
  meta: {
    messages: {
      notStoreDep,
      missingStoreDeps,
      extraStoreDeps,
    },
    docs: {
      description: 'Ensure connect store dependency arrays match what is used in the function',
      category: 'Code Safety',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    return {
      CallExpression(node, parent) {
        let isConnectStores =
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Flux' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'connectStores';
        let isUseStateFromStoresHook =
          node.callee.type === 'Identifier' &&
          (node.callee.name === 'useStateFromStores' ||
            node.callee.name === 'useStateFromStoresObject' ||
            node.callee.name === 'useStateFromStoresArray');
        if (!isConnectStores && !isUseStateFromStoresHook) {
          return;
        }

        let args = node.arguments;

        let storeDepsArg = args[0];
        if (storeDepsArg.type !== 'ArrayExpression') {
          return;
        }

        // Get the array of stores
        let inputDeps = [];
        storeDepsArg.elements.forEach((element) => {
          if (element.type === 'Identifier' && element.name.endsWith('Store')) {
            inputDeps.push(element.name);
          } else {
            context.report({
              node: element,
              message: notStoreDep,
            });
          }
        });

        // Get all stores that are used in the function body
        let actualDeps = [];

        traverse(context, args[1], (path) => {
          let node = path.node;
          if (node.type !== 'MemberExpression' || node.object.type !== 'Identifier') {
            return;
          }
          let name = node.object.name;
          if (name.endsWith('Store') && !actualDeps.includes(name)) {
            actualDeps.push(name);
          }
        });

        // Compare the input and actual deps and handle discrepancies
        let missingDeps = actualDeps.filter((dep) => !inputDeps.includes(dep));
        let extraDeps = inputDeps.filter((dep) => !actualDeps.includes(dep));

        if (!missingDeps.length && !extraDeps.length) return;

        let message = '';
        if (missingDeps.length > 0) {
          message = `Missing stores ${missingDeps.join(', ')} that are used in callback`;
        } else if (extraDeps.length > 0) {
          message = `Unused stores ${extraDeps.join(', ')} in stores array`;
        }

        context.report({
          node,
          message,

          fix(fixer) {
            return [fixer.replaceTextRange([storeDepsArg.start + 1, storeDepsArg.end - 1], actualDeps.join(', '))];
          },
        });
      },
    };
  },
};
