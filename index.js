export default function (lookup, target) {
  if (!Object.keys(lookup).length) {
    throw Error(`The supplied lookup JSON contains no keywords.`);
  }
  if (target && !lookup[target]) {
    throw Error(
      `The target localisation '${target}' was not found in the supplied lookup JSON.`
    );
  }
  return (word) => {
    const exchange = target ? lookup[target][word] : lookup[word];
    if (!exchange) {
      console.warn(
        `Warning: The word to be exchanged '${word}' could not be found in the lookup JSON. The original word will be used as a fallback.`
      );
      return word;
    }
    return exchange;
  };
}
