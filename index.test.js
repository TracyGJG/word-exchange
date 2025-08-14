import { afterEach, describe, it, mock } from 'node:test';
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
      assert.equal(
        console.warn.mock.calls[0].arguments[0],
        "Warning: The word to be exchanged 'Goodbye' could not be found in the lookup JSON. The original word will be used as a fallback."
      );
    });

    it('can resolve a keyword', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('Hello'), 'Hi');

      assert.equal(console.warn.mock.callCount(), 0);
    });
  });

  describe('multiple lookup', () => {
    const mockWarnConsole = mock.fn((_) => {});

    const LOOKUP = {
      French: {
        Hello: 'Bonjour',
        World: 'le monde',
      },
      German: {
        Hello: 'Hallo',
        World: 'Welt',
      },
    };

    const lookup = wordExchange(LOOKUP, 'French');

    afterEach(() => mockWarnConsole.mock.resetCalls());

    it('can resolve a keyword', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('Hello'), 'Bonjour');

      assert.equal(console.warn.mock.callCount(), 0);
    });
  });

  describe('with modifiers', () => {
    const mockWarnConsole = mock.fn((_) => {});

    const LOOKUP = {
      test: 'Test',
      end: 'The End of the WORLD is Nigh!',
    };

    const lookup = wordExchange(LOOKUP);

    afterEach(() => mockWarnConsole.mock.resetCalls());

    it('can convert to upper case a plaural', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('test', 'U', 'S|s'), 'TESTs');

      assert.equal(console.warn.mock.callCount(), 0);
    });

    it('can convert to prefixed in all lower case', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('test', 'P|The ', 'L'), 'the test');

      assert.equal(console.warn.mock.callCount(), 0);
    });

    it('can convert to title case', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('end'), 'The End of the WORLD is Nigh!');
      assert.equal(lookup('end', 'T'), 'The End Of The World Is Nigh!');

      assert.equal(console.warn.mock.callCount(), 0);
    });

    it('can replace text in the output', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('end'), 'The End of the WORLD is Nigh!');
      assert.equal(
        lookup('end', 'R|End|Begining', 'R|End|Begining'),
        'The Begining of the WORLD is Nigh!'
      );

      assert.equal(console.warn.mock.callCount(), 0);
    });

    it('can report an unrecognised option', (ctxt) => {
      ctxt.mock.method(console, 'warn', mockWarnConsole);
      assert.equal(console.warn.mock.callCount(), 0);

      assert.equal(lookup('test', 'P|The ', 'X', 'L'), 'the test');

      assert.equal(console.warn.mock.callCount(), 1);
      assert.equal(
        console.warn.mock.calls[0].arguments[0],
        "Warning: An unrecognised option has been supplied 'X'."
      );
    });
  });
});
