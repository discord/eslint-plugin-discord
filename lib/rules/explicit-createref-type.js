"use strict";

const explicitCreateRefTypeMessage = `React.createRef() class properties should be explicitly typed.`;

module.exports = {
  meta: {
    messages: {
      explicitCreateRefTypeMessage
    },
    docs: {
      description: "Force explicit type annotation on class properties storing a React.createRef()",
      category: "Best Practices"
    },
    schema: [
      {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    return {
      ClassProperty: node => {
        if (node.typeAnnotation) {
          return;
        }

        const value = node.value;
        if (value != null && value.type === "CallExpression") {
          const callee = value.callee;
          const typeArguments = value.typeArguments;
          if (
            callee.type === "MemberExpression" &&
            callee.object.name === "React" &&
            callee.property.name === "createRef" &&
            typeArguments == null
          ) {
            context.report({
              node,
              message: explicitCreateRefTypeMessage
            });
          }
        }
      }
    };
  }
};
