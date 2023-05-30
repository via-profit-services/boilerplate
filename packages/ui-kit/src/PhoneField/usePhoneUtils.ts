import React from 'react';

import templates, { CountryCode } from './templates';

export interface Formatted {
  readonly text: string;
  readonly caret: number;
  readonly countryCode: CountryCode | null;
  readonly callingCode: string | null;
  readonly number: string;
  readonly template: string;
  readonly placeholder: string;
  readonly isValid: boolean;
}

type Parse = (
  text: string,
  caret?: number,
) => {
  readonly text: string;
  readonly caret: number;
};

type GetTemplateInfo = (parsedValue: string) => {
  readonly countryCode: CountryCode | null;
  readonly callingCode: string | null;
  readonly template: string;
  readonly placeholder: string;
  readonly regexp: RegExp;
};

type Validate = (inputValue: string, template: string) => boolean;
type Format = (text: string, caret: number, defaultCountry?: string | null) => Formatted;
type ParseAndValidate = (inputValue: string) => boolean;
type ParseAndFormat = (inputValue: string, caret?: number) => Formatted;

export const usePhoneUtils = () => {
  /**
   * Get template info by parset value
   */
  const getTemplateInfo: GetTemplateInfo = React.useCallback(parsedValue => {
    const [countryCode, callingCode, template, placeholder, regexp] =
      templates.find(template => new RegExp(template[4]).test(parsedValue.trim())) || templates[0];

    return {
      countryCode,
      callingCode,
      template,
      placeholder,
      regexp,
    };
  }, []);

  /**
   * Get phone validation status
   */
  const validateParsedInput: Validate = React.useCallback((inputValue, template) => {
    const xLength = template.replace(/[^x\d]/g, '').split('').length;
    const digitLength = inputValue.replace(/[^\d]/g, '').split('').length;

    return xLength === digitLength;
  }, []);

  /**
   * Format phone string
   */
  const formatParsedInput: Format = React.useCallback(
    (inputValue, caret, defaultCountry) => {
      const defaultTemplateRecord = templates.find(t => t[0] === (defaultCountry || null));
      const [defaultCountryCode, defaultCountryCalling, defaultTemplate, defaultPlaceholder] =
        defaultTemplateRecord || templates[templates.length - 1];

      const data = {
        text: '',
        caret,
        countryCode: defaultCountryCode,
        callingCode: defaultCountryCalling,
        template: defaultTemplate,
        placeholder: defaultPlaceholder,
        number: '',
        isValid: false,
      };

      if (inputValue === '') {
        return data;
      }

      const { countryCode, callingCode, template, placeholder } = getTemplateInfo(inputValue);
      const mask = template.split('').map(c => (c === 'x' ? /\d/ : c));

      let charIndex = 0;
      for (let patternIndex = 0; patternIndex < mask.length; patternIndex++) {
        if (charIndex >= inputValue.length) {
          break;
        }

        const char = inputValue[charIndex];
        const template = mask[patternIndex];

        // If put +, but not first
        if (charIndex !== 0 && char === '+') {
          break;
        }

        if (template instanceof RegExp && new RegExp(template).test(char)) {
          data.text = `${data.text}${char}`;
          charIndex += 1;
        }

        if (typeof template === 'string' && template === char) {
          data.text = `${data.text}${char}`;
          charIndex += 1;
        }

        if (typeof template === 'string' && template !== char) {
          data.text = `${data.text}${template}`;
          if (charIndex < caret) {
            data.caret += 1;
          }
        }
      }

      // const templateLength = template.replace(/[^x\d]/g, '').split('').length;
      // const valueLength = inputValue.replace(/[^\d]/g, '').split('').length;

      const number = data.text.replace(/[^0-9]/g, '').substring(callingCode?.length || 0);

      return {
        ...data,
        countryCode,
        callingCode,
        template,
        placeholder,
        number,
        isValid: validateParsedInput(data.text, template),
      };
    },
    [getTemplateInfo, validateParsedInput],
  );

  /**
   * Parse phone string
   */
  const parseInput: Parse = React.useCallback((value: string, caret?: number) => {
    const data = {
      text: '',
      caret: 0,
    };

    value
      .trim()
      .split('')
      .forEach((character, charIndex) => {
        const isMatch = new RegExp(/[+0-9]/).test(character);
        if (isMatch) {
          data.text = `${data.text}${character}`;

          if (charIndex < (caret || 0)) {
            data.caret += 1;
          }
        }
      });

    return { ...data };
  }, []);

  const parseAndValidate: ParseAndValidate = React.useCallback(
    inputValue => {
      const { text } = parseInput(inputValue);
      const { template } = getTemplateInfo(text);

      return validateParsedInput(text, template);
    },
    [getTemplateInfo, parseInput, validateParsedInput],
  );

  const parseAndFormat: ParseAndFormat = React.useCallback(
    (inputValue, caret) => {
      const parsed = parseInput(inputValue, caret);

      return formatParsedInput(parsed.text, parsed.caret);
    },
    [formatParsedInput, parseInput],
  );

  return {
    /**
     * Validate parsed phone string by template\
     * ```js
     * // Example:
     * validateParsedInput('79129876543', '7 (xxx) xxx-xx-xx'); // true
     * validateParsedInput('79129876', '7 (xxx) xxx-xx-xx'); // false
     * ```
     */
    validateParsedInput,
    getTemplateInfo,

    /**
     * Parse plain phone string and validate result\
     * ```js
     * // Example:
     * parseAndValidate('+7 912 659-99-88'); // true
     * parseAndValidate('+7 912 659-99-'); // false
     * ```
     */
    parseAndValidate,

    parseAndFormat,

    /**
     * Format phone string by template\
     * ```js
     * // Example:
     * format('')
     * ```
     */
    formatParsedInput,

    /**
     * Parse input phone string\
     * ```js
     * // Example:
     * const { text, caret } = parseInput('+7 (912', 7); // { '7912', 4 }
     * ```
     */
    parseInput,
  };
};
