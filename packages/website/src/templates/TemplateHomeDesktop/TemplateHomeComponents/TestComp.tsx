import React from 'react';

export interface TestCompProps<T> {
  readonly value: T;
  readonly renderValue: (value: T) => React.ReactNode;
}

export interface TestCompRef<T> {
  setValue: (value: T) => void;
}

const TestComp = React.forwardRef(<T,>(props: TestCompProps<T>, ref: React.Ref<TestCompRef<T>>) => {
  const { value, renderValue } = props;
  const [currentValue, setCurrentValue] = React.useState(value);

  React.useImperativeHandle(ref, () => ({
    setValue: t => setCurrentValue(t),
  }));

  return <p>Text: {renderValue(currentValue)}</p>;
});

TestComp.displayName = 'TestComp';

export default TestComp as <T>(
  props: TestCompProps<T> & { ref: React.Ref<TestCompRef<T>> },
) => JSX.Element;
