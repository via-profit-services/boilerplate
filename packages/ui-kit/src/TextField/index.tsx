import * as React from 'react';

import TextFieldContainer from './TextFieldContainer';
import TextFieldLabel from './TextFieldLabel';
import TextFieldLabelAsterisk from './TextFieldLabelAsterisk';
import TextFieldWrapper from './TextFieldWrapper';
import TextFieldInput from './TextFieldInput';
import TextFieldErrorText from './TextFieldErrorText';
import TextFieldIconWrapper from './TextFieldIconWrapper';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly error?: boolean;
  readonly requiredAsterisk?: boolean | React.ReactNode;
  readonly errorText?: React.ReactNode;
  readonly fullWidth?: boolean;
  readonly showEmptyIfNoError?: boolean;
  readonly inputRef?: React.Ref<HTMLInputElement>;
  readonly label?: React.ReactNode;
  readonly endIcon?: React.ReactElement;
  readonly startIcon?: React.ReactElement;
}

const TextField: React.ForwardRefRenderFunction<HTMLDivElement, TextFieldProps> = (props, ref) => {
  const {
    error,
    fullWidth,
    inputRef,
    label,
    id,
    errorText,
    className,
    style,
    endIcon,
    startIcon,
    showEmptyIfNoError,
    onChange,
    requiredAsterisk,
    onFocus,
    onBlur,
    ...inputProps
  } = props;

  const [focused, setFocused] = React.useState(false);
  const inputID = React.useMemo(() => {
    if (typeof id === 'string') {
      return id;
    }

    const u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    const guid = [
      u.substring(0, 8),
      u.substring(8, 12),
      '4000-8' + u.substring(13, 16),
      u.substring(16, 28),
    ].join('-');

    return guid;
  }, [id]);

  const inputChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    event => {
      if (onChange) {
        onChange(event);
      }
    },
    [onChange],
  );

  const inputFocus: React.FocusEventHandler<HTMLInputElement> = React.useCallback(
    event => {
      setFocused(true);
      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    },
    [onFocus],
  );

  const inputBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback(
    event => {
      setFocused(false);
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    },
    [onBlur],
  );

  const hasStartIcon = React.useMemo(
    () => typeof startIcon !== 'undefined' && startIcon !== null,
    [startIcon],
  );
  const hasEndIcon = React.useMemo(
    () => typeof endIcon !== 'undefined' && endIcon !== null,
    [endIcon],
  );

  return (
    <TextFieldContainer
      ref={ref}
      fullWidth={fullWidth}
      className={className}
      style={style}
      focused={focused}
    >
      {typeof label !== 'undefined' && label !== null && (
        <TextFieldLabel htmlFor={inputID} error={error}>
          {label}
          {typeof requiredAsterisk !== 'undefined' && requiredAsterisk !== null && (
            <TextFieldLabelAsterisk>
              {typeof requiredAsterisk === 'boolean' ? '*' : requiredAsterisk}
            </TextFieldLabelAsterisk>
          )}
        </TextFieldLabel>
      )}

      <TextFieldWrapper error={error} focused={focused} fullWidth={fullWidth}>
        {hasStartIcon && <TextFieldIconWrapper position="start">{startIcon}</TextFieldIconWrapper>}

        <TextFieldInput
          {...inputProps}
          hasStartIcon={hasStartIcon}
          hasEndIcon={hasEndIcon}
          ref={inputRef}
          id={inputID}
          onChange={inputChange}
          onFocus={inputFocus}
          onBlur={inputBlur}
        />
        {hasEndIcon && <TextFieldIconWrapper position="end">{endIcon}</TextFieldIconWrapper>}
      </TextFieldWrapper>
      <TextFieldErrorText error={error} showEmptyIfNoError={showEmptyIfNoError} focused={focused}>
        {errorText}
      </TextFieldErrorText>
    </TextFieldContainer>
  );
};

export default React.forwardRef(TextField);
