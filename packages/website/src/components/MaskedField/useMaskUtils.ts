// import React from 'react';

// export interface Formatted {
//   readonly text: string;
//   readonly caret: number;
//   readonly value: string;
//   readonly template: string;
//   readonly placeholder: string;
//   readonly isValid: boolean;
// }

// type Parse = (
//   text: string,
//   caret?: number,
// ) => {
//   readonly text: string;
//   readonly caret: number;
// };

// type GetTemplateInfo = (parsedValue: string) => {
//   readonly placeholder: string;
//   readonly regexp: RegExp;
// };

// type Validate = (inputValue: string, template: string) => boolean;
// type Format = (text: string, caret: number, defaultCountry?: string | null) => Formatted;
// type ParseAndValidate = (inputValue: string) => boolean;
// type ParseAndFormat = (inputValue: string, caret?: number) => Formatted;

// const templates: [string, (RegExp | string)[]][] = [
//   ['A-777-AA', [/[a-zA-Z]/, '-', /\d/, /\d/, /\d/, '-', /[a-zA-Z]/, /[a-zA-Z]/]],
// ];

// export const useMaskUtils = () => {
//   /**
//    * Get phone validation status
//    */
//   const validateParsedInput: Validate = React.useCallback((inputValue, template) => {
//     const xLength = template.replace(/[^x\d]/g, '').split('').length;
//     const digitLength = inputValue.replace(/[^\d]/g, '').split('').length;

//     return xLength === digitLength;
//   }, []);

//   /**
//    * Format phone string
//    */
//   const formatParsedInput: Format = React.useCallback(
//     (inputValue, caret, defaultCountry) => {
//       const defaultTemplateRecord = templates.find(t => t[0] === (defaultCountry || null));
//       const [defaultTemplate, defaultPlaceholder] =
//         defaultTemplateRecord || templates[templates.length - 1];

//       const data = {
//         text: '',
//         caret,
//         template: defaultTemplate,
//         placeholder: defaultPlaceholder,
//         value: '',
//         isValid: false,
//       };

//       if (inputValue === '') {
//         return data;
//       }

//       // const mask = template.split('').map(c => (c === 'x' ? /\d/ : c));

//       let charIndex = 0;
//       for (let patternIndex = 0; patternIndex < mask.length; patternIndex++) {
//         if (charIndex >= inputValue.length) {
//           break;
//         }

//         const char = inputValue[charIndex];

//         // If put +, but not first
//         if (charIndex !== 0 && char === '+') {
//           break;
//         }

//         if (mask[patternIndex] instanceof RegExp && new RegExp(mask[patternIndex]).test(char)) {
//           data.text = `${data.text}${char}`;
//           charIndex += 1;
//         }

//         if (typeof mask[patternIndex] === 'string' && mask[patternIndex] === char) {
//           data.text = `${data.text}${char}`;
//           charIndex += 1;
//         }

//         if (typeof mask[patternIndex] === 'string' && mask[patternIndex] !== char) {
//           data.text = `${data.text}${mask[patternIndex]}`;
//           if (charIndex < caret) {
//             data.caret += 1;
//           }
//         }
//       }

//       const value = data.text;

//       return {
//         ...data,
//         template,
//         placeholder,
//         value,
//         isValid: validateParsedInput(data.text, template),
//       };
//     },
//     [validateParsedInput],
//   );

//   /**
//    * Parse phone string
//    */
//   const parseInput: Parse = React.useCallback((value: string, caret?: number) => {
//     const data = {
//       text: '',
//       caret: 0,
//     };

//     value
//       .trim()
//       .split('')
//       .forEach((character, charIndex) => {
//         const isMatch = new RegExp(/[+0-9]/).test(character);
//         if (isMatch) {
//           data.text = `${data.text}${character}`;

//           if (charIndex < (caret || 0)) {
//             data.caret += 1;
//           }
//         }
//       });

//     return { ...data };
//   }, []);

//   const parseAndValidate: ParseAndValidate = React.useCallback(
//     inputValue => {
//       const { text } = parseInput(inputValue);

//       return validateParsedInput(text, template);
//     },
//     [parseInput, validateParsedInput],
//   );

//   const parseAndFormat: ParseAndFormat = React.useCallback(
//     (inputValue, caret) => {
//       const parsed = parseInput(inputValue, caret);

//       return formatParsedInput(parsed.text, parsed.caret);
//     },
//     [formatParsedInput, parseInput],
//   );

//   return {
//     /**
//      * Validate parsed phone string by template\
//      * ```js
//      * // Example:
//      * validateParsedInput('79129876543', '7 (xxx) xxx-xx-xx'); // true
//      * validateParsedInput('79129876', '7 (xxx) xxx-xx-xx'); // false
//      * ```
//      */
//     validateParsedInput,

//     /**
//      * Parse plain phone string and validate result\
//      * ```js
//      * // Example:
//      * parseAndValidate('+7 912 659-99-88'); // true
//      * parseAndValidate('+7 912 659-99-'); // false
//      * ```
//      */
//     parseAndValidate,

//     parseAndFormat,

//     /**
//      * Format phone string by template\
//      * ```js
//      * // Example:
//      * format('')
//      * ```
//      */
//     formatParsedInput,

//     /**
//      * Parse input phone string\
//      * ```js
//      * // Example:
//      * const { text, caret } = parseInput('+7 (912', 7); // { '7912', 4 }
//      * ```
//      */
//     parseInput,
//   };
// };
