'use strict';

const badElementUsage = `Do not use HTML anchor (<a>) tags directly.  Please use uikit/Anchor instead.`;

/**
 * Returns the name of the node (jsxopeneingelement)
 *
 * @param {ASTNode} node
 * @returns {string} the name of the element (tag)
 */
function getElementName(node) {
  if (node != null && node.name != null && node.name.name != null) {
    return node.name.name.trim();
  }

  return '';
}

module.exports = {
  meta: {
    messages: {
      badElementUsage,
    },
    docs: {
      description: 'Enforce uikit/Anchor component usage over anchor HTML element',
      category: 'Accessibility',
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
      JSXOpeningElement: node => {
        if (getElementName(node) === 'a') {
          context.report({
            node,
            message: badElementUsage,
          });
        }
      },
    };
  },
};
