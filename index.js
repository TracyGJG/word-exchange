export default function (lookup, target) {
  if (!Object.keys(lookup).length) {
    throw Error(`The supplied lookup JSON contains no keywords.`);
  }
  if (target && !lookup[target]) {
    throw Error(
      `The target localisation '${target}' was not found in the supplied lookup JSON.`
    );
  }
  return (word, ...options) => {
    const exchange = target ? lookup[target][word] : lookup[word];
    if (!exchange) {
      console.warn(
        `Warning: The word to be exchanged '${word}' could not be found in the lookup JSON. The original word will be used as a fallback.`
      );
      return word;
    }

    const optionFn = {
      L: (text) => text.toLowerCase(),
      P: (text, fix) => `${fix}${text}`,
      R: (text, from, to) => text.replace(from, to),
      S: (text, fix) => `${text}${fix}`,
      T: (text) =>
        text
          .toLowerCase()
          .split(/\s+/)
          .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
          .join(' '),
      U: (text) => text.toUpperCase(),
    };

    return `${options.reduce((text, opt) => {
      const [fnPar, arg1, arg2] = `${opt}||`.split('|');
      const fn = optionFn[fnPar];
      if (!fn) {
        console.warn(
          `Warning: An unrecognised option has been supplied '${fnPar}'.`
        );
        return text;
      }
      return fn(text, arg1, arg2);
    }, exchange)}`;
  };
}
