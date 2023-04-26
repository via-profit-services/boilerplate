import styled from '@emotion/styled';

const ButtonBase = styled.button`
  padding: 0.7em 1.4em;
  cursor: pointer;
  font-size: 0.86rem;
  border: 0;
  outline: 2px solid transparent;
  transition: all 180ms ease-out 0s;
  color: ${({ theme }) => theme.colors.text.default};
`;

export default ButtonBase;
