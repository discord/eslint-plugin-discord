'use strict';

const {hasProp, elementType} = require('jsx-ast-utils');

const useAnchorMessage = `Do not use HTML anchor (<a>) tags directly.  Please use uikit/Anchor.`;
const useClickableMessage = `Don't use onClick on non-button HTMLElement. Please use uikit/Clickable.`;

module.exports = {
  meta: {
    messages: {
      useAnchorMessage,
      useClickableMessage,
    },
    docs: {
      description: 'Custom a11y component enforcement',
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
        const tag = elementType(node);

        if (tag === 'a') {
          // Don't use `a` use `Anchor`
          context.report({
            node,
            message: useAnchorMessage,
          });
        } else if (tag !== 'button' && /^[a-z]/.test(tag) && hasProp(node.attributes, 'onClick')) {
          // Don't use `onClick` on non-button HTMLElement, use Clickable
          context.report({
            node,
            message: useClickableMessage,
          });
        }
      },
    };
  },
};
