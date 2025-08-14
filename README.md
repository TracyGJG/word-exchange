# word-exchange

A simple utility for globally replacing text in an application.

This is particularly useful for simple language substitution for localisation (L10n) of individual fragments of text.

## How it works

Initialise the lookup function in one of two ways depending on the number of exchange options.

```js
// Use this when the lookupTable is a simple one-to-one reference.
const lookup = wordExchange(lookupTable);

// Use this when the lookupTable is a one-to-many targets (languages) reference.
const lookup = wordExchange(lookupTable, targetSet);
// The second parameter `targetSet` identifies which language is to be used to provide localisation.
```

In the simple case the lookupTable will assume the following format:

```js
{
  "reference word": "target word",
  :
}
```

When there is more than one target set defined the structure of the lookupTable will be as below:

```js
{
  "target set" : {
    "reference word": "target word",
    :
  },
  :
}
```

The above structure is arranged so a new target set can be added easily with minimal potential for disrupting the rest of the data.

Once initialised, the function that is generated (`lookup` in the example above) is used to wrap the base word that will be exchanged for the localised equivalent.

## Modifing options

The `lookup` function has an optional set of parameters from the second onwards. These are used to modify the resultant string according to the following definitions:

- `L` converts the string to lower case (small letters).
- `P|prefix` prepends the prefix text that appears after the vertical bar.
- `R|from|to` replaces the first encounter of the text `from` with the text `to`, separated by the vertical bar.
- `S|suffix` appends the suffix text that appears after the vertical bar.
- `T` converts to title case when every word starts with an upper case letter, with the remaining in lower case.
- `U` converts the string to upper case (capital letters).

```js
const lookupTable = {
  test: 'Test',
  world: 'The World',
};

const lookup = wordExchange(lookupTable);

console.log(lookup('test')); // "Test"

console.log(lookup('test', 'L', 'S|ing')); // "testing"

console.log(lookup('test', 'P|The ', 'U')); // "THE TEST"

console.log(lookup('world', 'T|World|Earth')); // "The Earth"
```

Note: The order in which the modifiers are included in the call is significant, and affects when and what the modifers are applied.
