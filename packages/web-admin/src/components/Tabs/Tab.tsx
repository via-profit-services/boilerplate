import * as React from 'react';
import styled from '@emotion/styled';

import ButtonBase from '@boilerplate/ui-kit/src/Button/ButtonBase';

export interface TabProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly active?: boolean;
  readonly children: React.ReactNode;
}

const TabContainer = styled(ButtonBase)<{ $isActive?: boolean }>`
  font-size: 0.9em;
  padding: 0.6em 1em;
  font-weight: 400;
  color: ${props => props.theme.colors.text.default};
  cursor: pointer;
  background-color: ${props => (props.$isActive ? 'rgb(247, 184, 0)' : 'transparent')};
`;

const TabRef: React.ForwardRefRenderFunction<HTMLButtonElement, TabProps> = (props, ref) => {
  const { active, children, ...otherProps } = props;

  return (
    <TabContainer type="button" {...otherProps} ref={ref} $isActive={active}>
      {children}
    </TabContainer>
  );
};

const Tab = React.forwardRef(TabRef);

export default Tab;

export { Tab };
