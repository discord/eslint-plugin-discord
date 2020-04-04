'use strict';

const rule = require('../../../lib/rules/store-connect-deps');

const onClick = `onClick={()=>{}}`;

module.exports = (ruleTester) =>
  ruleTester.run('store-connect-deps', rule, {
    valid: [
      `
    Flux.connectStores([TestStore, TestingStore], () => {
      const a = TestStore.a;
      const b = TestStore.getB(TestingStore.getId());
      return {
        a,
        b,
        c: TestingStore.c,
      }
    })

    const x = useStateFromStores([TestStore, TestingStore], () => {
      const a = TestStore.a;
      const b = TestingStore.getB(TestingStore.getId());
      return a && b
    })

    const y = useStateFromStoresObject([TestStore, TestingStore], () => {
      const a = TestStore.a;
      const b = TestStore.getB(TestingStore.getId());
      return {
        a,
        b,
        c: TestingStore.c,
      }
    })

    const foo = {bar: 0};
    const z = useStateFromStoresArray([TestStore, TestingStore], () => {
      const a = TestStore.a;
      const b = TestStore.getB(foo.bar);
      return [
        a,
        b,
        TestingStore.c,
      ]
    })
    `,
    ],

    invalid: [
      {
        code: `useStateFromStores([test], () => {
          return null
        })`,
        errors: [{ messageId: 'notStoreDep' }],
      },
      {
        code: `useStateFromStores([TestStore, TestingStore], () => {
          return null
        })`,
        errors: [{ messageId: 'extraStoreDeps', data: { stores: 'TestStore, TestingStore' } }],
      },
      {
        code: `useStateFromStores([TestStore], () => {
          return TestStore.foo && TestingStore.bar
        })`,
        errors: [{ messageId: 'missingStoreDeps', data: { stores: 'TestingStore' } }],
      },
      {
        code: `useStateFromStores([TestStore], () => TestStore.foo() && TestingStore.bar() && Store.s)`,
        errors: [{ messageId: 'missingStoreDeps', data: { stores: 'Store, TestingStore' } }],
      },
    ],
  });
