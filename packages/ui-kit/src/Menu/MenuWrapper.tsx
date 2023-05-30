import React from 'react';
import styled from '@emotion/styled';
import Color from 'color';

export interface MenuWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly isOpen: boolean;
  readonly dimensions: {
    readonly width: number;
    readonly height: number;
  };
}

const StyledMenuWrapper = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  transition: visibility 120ms ease-out, opacity 120ms ease-out;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 2}em;
  box-shadow: 0 4px 24px
    ${({ theme }) => Color(theme.colors.backgroundPrimary).darken(0.5).alpha(0.6).rgb().string()};
  &:focus {
    outline: none;
  }
  & ::-webkit-scrollbar {
    width: 0.6rem;
    height: 0.6rem;
  }

  & ::-webkit-scrollbar-corner {
    background: none;
  }

  & ::-webkit-scrollbar-track {
    background: ${({ theme }) =>
      theme.isDark
        ? Color(theme.colors.backgroundPrimary).darken(0.1).rgb().string()
        : Color(theme.colors.backgroundPrimary).darken(0.05).rgb().string()};
  }

  & ::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.isDark
        ? Color(theme.colors.backgroundSecondary).lighten(0.3).rgb().string()
        : Color(theme.colors.backgroundSecondary).darken(0.3).rgb().string()};
    border-radius: 0.3rem;
  }

  & ::-webkit-scrollbar-thumb:horizontal:hover,
  & ::-webkit-scrollbar-thumb:vertical:hover {
    background: ${({ theme }) => theme.colors.accentPrimary};
  }
`;

const MenuWrapperInner = styled.div<Pick<MenuWrapperProps, 'dimensions'>>`
  padding: 0.4em;
  box-sizing: content-box;
  min-width: ${({ dimensions }) => dimensions.width}px;
  min-height: ${({ dimensions }) => dimensions.height}px;
`;

const MenuWrapper: React.ForwardRefRenderFunction<HTMLDivElement, MenuWrapperProps> = (
  props,
  ref,
) => {
  const { isOpen, dimensions, children, ...nativeProps } = props;
  const [isOpenState, setOpenState] = React.useState(false);

  React.useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  return (
    <StyledMenuWrapper {...nativeProps} ref={ref} $isOpen={isOpenState}>
      <MenuWrapperInner dimensions={dimensions}>{children}</MenuWrapperInner>
    </StyledMenuWrapper>
  );
};

export default React.forwardRef(MenuWrapper);
