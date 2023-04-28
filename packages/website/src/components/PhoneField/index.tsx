import React from 'react';

import TextField, { TextFieldProps } from '~/components/TextField';
import { usePhoneUtils } from './usePhoneUtils';
import templates, { CountryCode } from './templates';
import CountryFlag from './CountryFlag';

export interface PhoneFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  /**
   * Phone string format 79876543210 or +7 (987) 654-32-10
   */
  readonly value: string;
  readonly defaultCountry?: CountryCode | null;
  readonly onChange: (payload: PhonePayload) => void;
}

export interface PhonePayload {
  /**
   * Phone formatted string, e.g.: +7 (987) 654-32-10
   */
  readonly value: string;
  /**
   * Country code (ISO 3166-1 alpha-2), e.g.: RU
   */
  readonly countryCode: string | null;
  /**
   * Phone template, e.g.: +7 (xxx) xxx-xx-xx. The symbol «x» - is a digit
   */
  readonly template: string;
  /**
   * Phone placeholder, e.g.: +7 (999) 999-99-99
   */
  readonly placeholder: string;
  /**
   * Country calling code, e.g.: 7
   */
  readonly callingCode: string | null;
  /**
   * Phone number without calling code and formatters
   */
  readonly number: string;
  /**
   * Phone number with calling code
   */
  readonly combined: string;
  /**
   * Phone validation status
   */
  readonly isValid: boolean;
}

export { usePhoneUtils, templates };

const PhoneField: React.ForwardRefRenderFunction<HTMLDivElement, PhoneFieldProps> = (
  props,
  ref,
) => {
  const { value, defaultCountry, onChange, inputRef, ...textFieldProps } = props;
  const { formatParsedInput, parseInput, parseAndFormat } = usePhoneUtils();
  const textInputRef = React.useRef<HTMLInputElement | null>(null);
  const initialValue = React.useRef(value);

  const [state, setState] = React.useState(() => {
    const { text, countryCode, placeholder, number } = parseAndFormat(String(initialValue.current));

    return {
      currentValue: text,
      number,
      countryCode,
      placeholder,
    };
  });
  const { countryCode, currentValue, placeholder } = state;

  React.useEffect(() => {
    if (initialValue.current !== value) {
      initialValue.current = value;

      const formatted = parseAndFormat(String(value));

      if (formatted.text !== currentValue) {
        setState(prev => ({
          ...prev,
          currentValue: formatted.text,
          countryCode: formatted.countryCode,
          placeholder: formatted.placeholder,
        }));
      }
    }
  }, [countryCode, currentValue, parseAndFormat, placeholder, value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const parsed = parseInput(
      String(event.currentTarget.value),
      textInputRef.current?.selectionStart || 0,
    );

    const { caret, text, template, placeholder, countryCode, callingCode, number, isValid } =
      formatParsedInput(parsed.text, parsed.caret);

    onChange({
      value: text,
      placeholder,
      template,
      countryCode,
      callingCode,
      number,
      isValid,
      combined: `${callingCode}${number}`,
    });

    setState(prev => ({
      ...prev,
      currentValue: text,
      countryCode,
      placeholder,
    }));
    setTimeout(() => {
      textInputRef.current?.setSelectionRange(caret, caret);
    }, 15);
  };

  return (
    <TextField
      ref={ref}
      {...textFieldProps}
      startIcon={
        <CountryFlag
          countryCode={countryCode}
          onClick={() => {
            if (textInputRef.current) {
              textInputRef.current.select();
              textInputRef.current.focus();
            }
          }}
        />
      }
      value={currentValue}
      placeholder={placeholder}
      onChange={handleChange}
      inputRef={input => {
        textInputRef.current = input;
        if (inputRef && typeof inputRef === 'object') {
          (inputRef as any).current = input;
        }
      }}
    />
  );
};

export default React.forwardRef(PhoneField);
