import React from 'react';

import { useMasked, Mask, FormatParsedPayload, ParseInput } from './useMasked';
import TextField, { TextFieldProps } from '../TextField';

export type GetMask = (input: string) => Mask;

export interface Payload {
  readonly text: string;
  readonly caret: number;
  readonly isValid: boolean;
}

export interface MaskedFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  /**
   * Field value
   */
  readonly value: string | null;

  /**
   * An array of RegExp or a function that returns an array of RegExp
   */
  readonly mask: Mask | GetMask;

  /**
   * Function will be called when field value was changed
   */
  readonly onChange: (payload: FormatParsedPayload) => void;

  /**
   * If you are not using a simple mask, you can provide a function to analyze the input value
   */
  readonly parseInput?: ParseInput;

  /**
   * You can transform the output value before using it
   */
  readonly transform?: (value: string) => string;
}

const MaskedField: React.ForwardRefRenderFunction<HTMLDivElement, MaskedFieldProps> = (
  props,
  ref,
) => {
  const { value: propValue, mask, parseInput, onChange, transform, ...nativeProps } = props;
  const textInputRef = React.useRef<HTMLInputElement | null>(null);
  const decoratorsErrorDisplayed = React.useRef(false);

  const masked = useMasked();
  const parseInputFn = parseInput || masked.parseInput;
  const getMask = React.useCallback(
    (input: string) => {
      const currentMask = typeof mask === 'function' ? mask(input) : mask;
      if (
        !decoratorsErrorDisplayed.current &&
        currentMask.find(
          elem =>
            typeof elem === 'string' &&
            typeof parseInput === 'undefined' &&
            elem.match(/[0-9a-zа-яё]/i),
        )
      ) {
        decoratorsErrorDisplayed.current = true;
        console.warn(
          `[MaskedField component] You use symbols as decorators, which should be replaced with RegExp or provide the «parseInput» function instead`,
        );
      }

      return currentMask;
    },
    [mask, parseInput],
  );

  const [inputValue, setInputValue] = React.useState(() => {
    const mask = getMask(propValue || '');

    const parsed = parseInputFn(propValue || '', mask, textInputRef.current?.selectionStart || 0);

    const { text } = masked.formatParsedInput(parsed.text, mask, parsed.caret);

    return text;
  });

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    event => {
      const mask = getMask(event.currentTarget.value);
      const parsed = parseInputFn(
        event.currentTarget.value,
        mask,
        textInputRef.current?.selectionStart || 0,
      );

      const { caret, isValid, text } = masked.formatParsedInput(parsed.text, mask, parsed.caret);
      const transformedText = transform ? transform(text) : text;

      setInputValue(transformedText);
      onChange({
        caret,
        isValid,
        text: transformedText,
      });

      setTimeout(() => {
        textInputRef.current?.setSelectionRange(caret, caret);
      }, 15);
    },
    [getMask, masked, transform, onChange, parseInputFn],
  );

  return (
    <TextField
      ref={ref}
      {...nativeProps}
      inputRef={textInputRef}
      type="text"
      value={inputValue}
      onChange={handleOnChange}
    />
  );
};

export default React.forwardRef(MaskedField);
