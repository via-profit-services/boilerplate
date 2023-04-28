import React from 'react';

import { useMasked, Mask, FormatParsedPayload } from './useMasked';

export type GetMask = (input: string) => Mask;

export interface Payload {
  readonly text: string;
  readonly caret: number;
  readonly isValid: boolean;
}

export interface MaskedFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  readonly value: string | null;
  readonly mask: Mask | GetMask;
  readonly onChange: (payload: FormatParsedPayload) => void;
}

const MaskedField: React.FC<MaskedFieldProps> = props => {
  const { value: propValue, mask, onChange, ...nativeProps } = props;
  const textInputRef = React.useRef<HTMLInputElement | null>(null);

  const { parseInput, formatParsedInput } = useMasked();
  const getMask = React.useCallback(
    (input: string) => (typeof mask === 'function' ? mask(input) : mask),
    [mask],
  );

  const [inputValue, setInputValue] = React.useState(() => {
    const mask = getMask(propValue || '');
    const parsed = parseInput(propValue || '', mask, textInputRef.current?.selectionStart || 0);

    const { text } = formatParsedInput(parsed.text, mask, parsed.caret);

    return text;
  });

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    event => {
      const mask = getMask(event.currentTarget.value);
      const parsed = parseInput(
        event.currentTarget.value,
        mask,
        textInputRef.current?.selectionStart || 0,
      );

      const { caret, isValid, text } = formatParsedInput(parsed.text, mask, parsed.caret);

      setInputValue(text);
      onChange({
        caret,
        isValid,
        text,
      });

      setTimeout(() => {
        textInputRef.current?.setSelectionRange(caret, caret);
      }, 15);
    },
    [formatParsedInput, parseInput, getMask, onChange],
  );

  return (
    <input
      {...nativeProps}
      ref={textInputRef}
      type="text"
      value={inputValue}
      onChange={handleOnChange}
    />
  );
};

export default MaskedField;
