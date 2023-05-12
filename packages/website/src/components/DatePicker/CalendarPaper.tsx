import styled from '@emotion/styled';
import Color from 'color';

const CalendarPaper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.shape.radiusFactor * 1}em;
  padding: 0.4em;
  box-shadow: 0 4px 24px
    ${({ theme }) => Color(theme.colors.backgroundPrimary).darken(0.5).alpha(0.6).rgb().string()};
`;

export default CalendarPaper;
