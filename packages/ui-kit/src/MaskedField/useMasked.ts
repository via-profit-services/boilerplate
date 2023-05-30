import React from 'react';

export type Mask = (RegExp | string)[];

export interface ParseInputPayload {
  readonly text: string;
  readonly caret: number;
}

export interface FormatParsedPayload {
  readonly text: string;
  readonly caret: number;
  readonly isValid: boolean;
}

export type ParseInput = (value: string, mask: Mask, caret?: number) => ParseInputPayload;
export type FormatParsed = (parsedValue: string, mask: Mask, caret: number) => FormatParsedPayload;

export const useMasked = () => {
  const parseInput: ParseInput = React.useCallback((value, mask, caret) => {
    const data = {
      text: '',
      caret: 0,
    };

    value
      .replace(/\s/, '')
      .split('')
      .forEach((character, charIndex) => {
        const isMatch = mask.some(pattern => {
          if (typeof pattern === 'string') {
            // return false;
            return character === pattern && character;
          }

          if (pattern instanceof RegExp) {
            return new RegExp(pattern).test(character);
          }

          return false;
        });

        if (isMatch) {
          data.text = `${data.text}${character}`;

          if (charIndex < (caret || 0)) {
            data.caret += 1;
          }
        }
      });

    const result: ParseInputPayload = {
      ...data,
    };

    return result;
  }, []);

  const formatParsedInput: FormatParsed = React.useCallback((parsedValue, mask, caret) => {
    const data = {
      text: '',
      caret,
      isValid: false,
      charIndex: 0,
    };

    if (parsedValue === '') {
      return data;
    }

    for (let patternIndex = 0; patternIndex < mask.length; patternIndex++) {
      if (data.charIndex >= parsedValue.length) {
        break;
      }

      const char = parsedValue[data.charIndex];
      const pattern = mask[patternIndex];

      // If char is correct (matched with Regexp pattern)
      // then accept char into text
      // and increment the charIndex and caret
      if (pattern instanceof RegExp && new RegExp(pattern).test(char)) {
        data.text = `${data.text}${char}`;
        data.charIndex += 1;
        data.caret += 1;
      }

      // If char is correct (equal with pattern string)
      // then accept char into text
      // and increment the charIndex and caret
      if (typeof pattern === 'string' && pattern === char) {
        data.text = `${data.text}${char}`;
        data.charIndex += 1;
        data.caret += 1;
      }

      // If pattern is a string and char is not correct
      // (not equal with pattern string)
      // then accept pattern string into text and increment caret
      if (typeof pattern === 'string' && pattern !== char) {
        data.text = `${data.text}${pattern}`;
        data.caret += 1;
      }
    }

    const result: FormatParsedPayload = {
      text: data.text,
      caret: data.caret,
      isValid: data.text.length >= mask.length,
    };

    return result;
  }, []);

  const parseAndFormat = React.useCallback(
    (inputValue: string, mask: Mask, caret?: number) => {
      const parsed = parseInput(inputValue, mask, caret);

      return formatParsedInput(parsed.text, mask, parsed.caret);
    },
    [formatParsedInput, parseInput],
  );

  return {
    formatParsedInput,
    parseAndFormat,
    parseInput,
  };
};

export default useMasked;
