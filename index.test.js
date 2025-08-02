import { afterEach, describe, it, test, mock } from 'node:test';
import assert from 'node:assert/strict';

import wordExchange from './index.js';

describe('Word Exchange', () => {
  describe('empty lookup', () => {
    const LOOKUP = {};

    it('can report an exception when there are no keywords in the lookup', () => {
      const emptyLookupTest = () => wordExchange(LOOKUP);

      assert.throws(
        emptyLookupTest,
        /^Error: The supplied lookup JSON contains no keywords\.$/
      );
    });
  });

  describe('missing lookup', () => {
    const LOOKUP = {
      French: {},
      German: {},
    };

    it('can report an exception when there is a missing target in the lookup', () => {
      const missingLookupTest = () => wordExchange(LOOKUP, 'Spanish');

      assert.throws(
        missingLookupTest,
        /^Error: The target localisation 'Spanish' was not found in the supplied lookup JSON\.$/
      );
    });
  });

  describe('simple lookup', () => {
    const mockWarnConsole = mock.fn((_) => {});

    const LOOKUP = {
      Hello: 'Hi',
      World: 'All',
    };

    const lookup = wordExchange(LOOKUP);

    afterEach(() => mockWarnConsole.mock.resetCalls());

    it('can report when the keyword is not found', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('Goodbye'), 'Goodbye');

      assert.equal(console.warn.mock.callCount(), 1);
    });

    it('can resolve a keyword (matching case)', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('Hello'), 'Hi');

      assert.equal(console.warn.mock.callCount(), 0);
    });
  });
});
