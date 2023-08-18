import styled from '@emotion/styled';

const Label = styled.span`
  font-size: 0.8em;
  display: inline-flex;
  margin-bottom: 1em;
  color: ${({ theme }) => theme.color.textSecondary.toString()};
`;

export default Label;
