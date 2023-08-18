import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import Button from '@via-profit/ui-kit/Button';

import ArrowUpOutline from '~/components/Icons/ArrowUpOutline';
import { useContext } from './useContext';

const BottombarContainer = styled.header`
  background-color: ${({ theme }) => theme.color.surface.toString()};
  padding: 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ClientsListBottombar: React.FC = () => {
  const { state } = useContext();
  const theme = useTheme();
  const { listOuterRef } = state;

  const handleClickScroll = React.useCallback(() => {
    listOuterRef?.scrollTo({
      behavior: 'smooth',
      top: 0,
      left: 0,
    });
  }, [listOuterRef]);

  return React.useMemo(
    () => (
      <BottombarContainer>
        <Button
          iconOnly
          variant="standard"
          color={theme.color.textPrimary.toString()}
          onClick={handleClickScroll}
        >
          <ArrowUpOutline />
        </Button>
      </BottombarContainer>
    ),
    [theme.color.textPrimary, handleClickScroll],
  );
};

export default ClientsListBottombar;
