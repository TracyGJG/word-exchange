# word-exchange

A simple utility for globally replacing text in an application.

This is particularly useful for simple language substitution for localisation (L10n) of individual fragments of text.

## How it works

Initialise the lookup function in one of two ways depending on the number of exchange options.

```js
const lookup = wordExchange(lookupTable); // Use this when the lookupTable is a simple one-to-one reference.

const lookup = wordExchange(lookupTable, targetSet); // Use this when the lookupTable is a one-to-many targets (languages) reference.
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
