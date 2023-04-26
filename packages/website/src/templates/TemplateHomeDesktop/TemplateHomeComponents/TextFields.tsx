import React from 'react';
import styled from '@emotion/styled';

import ErrorBoundary from '~/components/ErrorBoundary';
import H3 from '~/components/Typography/H3';
import TextField from '~/components/TextField';
import IconBell from '~/components/Icons/IconBell';
import IconAir from '~/components/Icons/IconAir';
import Button from '~/components/Button';

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const FieldsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TextFieldElement: React.FC = () => {
  const [value, setValue] = React.useState('');

  const isInvalid = React.useMemo(() => {
    const inputValue = value.trim().toLocaleLowerCase();

    return inputValue.length > 0 && inputValue.match(/^potato$/) === null;
  }, [value]);

  return (
    <TextField
      fullWidth
      requiredAsterisk
      label="Type «potato»"
      placeholder="potato"
      error={isInvalid}
      errorText={isInvalid ? 'Type «potato» please!' : undefined}
      value={value}
      onChange={event => setValue(event.currentTarget.value)}
    />
  );
};

const TextFields: React.FC = () => (
  <ErrorBoundary>
    <Section>
      <H3>Text fields</H3>
      <FieldsWrapper>
        <TextFieldElement />
      </FieldsWrapper>
      <FieldsWrapper>
        <TextField label="Not controlled" startIcon={<IconBell />} error errorText="Error label" />
        <TextField label="Not controlled" startIcon={<IconBell />} />
      </FieldsWrapper>

      <FieldsWrapper>
        <TextField label="Not controlled" endIcon={<IconAir />} />
        <TextField label="Not controlled" startIcon={<IconBell />} endIcon={<IconAir />} />
      </FieldsWrapper>
      <FieldsWrapper>
        <TextField
          label="Not controlled"
          endIcon={
            <Button variant="accent" onClick={() => console.log('click')}>
              <IconAir />
            </Button>
          }
        />
      </FieldsWrapper>
    </Section>
  </ErrorBoundary>
);

export default TextFields;
