import React from 'react';

// import { useMaskUtils } from './useMaskUtils';

export interface MaskedFieldProps {
  readonly value: string | null;
  readonly onChange: (payload: InputPayload) => void;
}

export interface InputPayload {
  /**
   * Phone formatted string, e.g.: +7 (987) 654-32-10
   */
  readonly value: string;

  /**
   * Phone template, e.g.: +7 (xxx) xxx-xx-xx. The symbol «x» - is a digit
   */
  readonly template: string;
  /**
   * Phone placeholder, e.g.: +7 (999) 999-99-99
   */
  readonly placeholder: string;

  /**
   * Phone validation status
   */
  readonly isValid: boolean;
}

const template: (RegExp | string)[] = [
  /\d/,
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];

const MaskedField: React.FC<MaskedFieldProps> = props => {
  const { value: propValue, onChange } = props;
  const textInputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = React.useState(propValue);
  // const initialValue = React.useRef(propValue);
  // const { formatParsedInput, parseInput, parseAndFormat } = useMaskUtils();

  // const [state, setState] = React.useState(() => {
  //   const { text, placeholder, value } = parseAndFormat(String(initialValue.current));

  //   return {
  //     currentValue: text,
  //     value,
  //     placeholder,
  //   };
  // });
  // const { currentValue, placeholder } = state;

  // React.useEffect(() => {
  //   if (initialValue.current !== propValue) {
  //     initialValue.current = propValue;

  //     const formatted = parseAndFormat(String(propValue));

  //     if (formatted.text !== currentValue) {
  //       setState(prev => ({
  //         ...prev,
  //         currentValue: formatted.text,
  //         placeholder: formatted.placeholder,
  //       }));
  //     }
  //   }
  // }, [currentValue, parseAndFormat, propValue]);

  // const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
  //   const parsed = parseInput(
  //     String(event.currentTarget.value),
  //     textInputRef.current?.selectionStart || 0,
  //   );

  //   const { caret, text, template, placeholder, value, isValid } = formatParsedInput(
  //     parsed.text,
  //     parsed.caret,
  //   );

  //   onChange({
  //     value: text,
  //     placeholder,
  //     template,
  //     isValid,
  //   });

  //   setState(prev => ({
  //     ...prev,
  //     currentValue: text,
  //     placeholder,
  //   }));
  //   setTimeout(() => {
  //     textInputRef.current?.setSelectionRange(caret, caret);
  //   }, 15);
  // };

  const parseInput = React.useCallback((value: string, caret?: number) => {
    const data = {
      text: '',
      caret: 0,
    };

    value.split('').forEach((character, charIndex) => {
      const isMatch = template.some(pattern => {
        if (typeof pattern === 'string') {
          return character === pattern;
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

    return { ...data };
  }, []);

  const formatParsedInput = React.useCallback((parsedValue: string, caret: number) => {
    const data = {
      text: '',
      caret,
      isValid: false,
      charIndex: 0,
      // matched: false,
    };

    if (parsedValue === '') {
      return data;
    }

    for (let patternIndex = 0; patternIndex < template.length; patternIndex++) {
      if (data.charIndex >= parsedValue.length) {
        break;
      }

      const char = parsedValue[data.charIndex];
      const pattern = template[data.charIndex];

      console.log(`«${char}» in «${pattern}»`);

      if (pattern instanceof RegExp && new RegExp(pattern).test(char)) {
        data.text = `${data.text}${char}`;
        data.charIndex += 1;
        data.caret += 1;
      }

      if (typeof pattern === 'string' && pattern === char) {
        data.text = `${data.text}${char}`;
        data.charIndex += 1;
        data.caret += 1;
      }

      if (typeof pattern === 'string' && pattern !== char) {
        data.text = `${data.text}${pattern}`;
        data.caret += 1;
        data.charIndex += 1;

        break;
        // return formatParsedInput(data.text, data.caret + 1)

        // if (data.charIndex < caret) {
        //   data.caret += 1;
        // }
      }

      // if (typeof pattern === 'string' && pattern !== char) {
      //   // let matched = false;
      //   // for (let i = patternIndex; i < template.length; i++) {
      //   data.text = `${data.text}${pattern}`;
      //   data.caret += 1;
      //   // }

      //   if (template[patternIndex + 1] === char) {
      //     data.text = `${data.text}${pattern}`;
      //     data.caret += 1;
      //   } else {
      //     break;
      //   }

      //   // break;
      // }
    }

    return {
      ...data,
      // isValid: validateParsedInput(data.text, template),
    };
  }, []);

  return (
    <>
      <p>9 (999) 999-99-99</p>
      <input
        ref={textInputRef}
        type="text"
        value={inputValue || ''}
        onChange={event => {
          const str = event.currentTarget.value;

          const parsed = parseInput(str);
          const formatted = formatParsedInput(parsed.text, parsed.caret);
          // console.log(formatted);
          setInputValue(formatted.text);
          setTimeout(() => {
            textInputRef.current?.setSelectionRange(formatted.caret, formatted.caret);
          }, 15);
        }}
      />
    </>
  );
};

export default MaskedField;
