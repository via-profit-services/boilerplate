import * as React from 'react';
import styled from '@emotion/styled';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly header?: React.ReactNode;
}

const Container = styled.div`
  background: ${props => props.theme.colors.background.area};
  box-shadow: ${props => props.theme.shadows.elevation0};
  border-radius: 1em;
  margin-bottom: 1em;
`;

const HeaderContainer = styled.div`
  padding: 1em;
  font-size: 1.1em;
  font-weight: 600;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
`;

const HeaderContent = styled.div`
  padding: 1em;
`;

const Card: React.ForwardRefRenderFunction<HTMLDivElement, CardProps> = (props, ref) => {
  const { children, header } = props;

  return (
    <Container ref={ref}>
      {typeof header !== 'undefined' && header !== null && (
        <HeaderContainer>{header}</HeaderContainer>
      )}
      <HeaderContent>{children}</HeaderContent>
    </Container>
  );
};

export default React.forwardRef(Card);
