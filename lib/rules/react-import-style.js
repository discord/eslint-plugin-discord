'use strict';

const improperReactImport = `Import react in the following style: "import * as React from 'react';"`;

/**
 * Returns the name of the module imported
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string} the name of the module, or empty string if no name.
 */
function getValue(node) {
  if (node != null && node.source != null && node.source.value != null) {
    return node.source.value.trim();
  }

  return '';
}

module.exports = {
  meta: {
    messages: {
      improperReactImport,
    },
    docs: {
      description: 'Force import * as React style',
      category: 'Best Practices',
    },
    schema: [
      {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    ],
  },

  create: function(context) {
    return {
      ImportDeclaration: node => {
        const value = getValue(node);

        if (value === 'react') {
          const {text} = context.getSourceCode(node);
          if (text === `import React from 'react';`) {
            context.report({
              node,
              message: improperReactImport,
            });
          }
        }
      },
    };
  },
};
