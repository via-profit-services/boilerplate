import React from 'react';
import styled from '@emotion/styled';

import useClient, {
  ResolvePayload,
  ResolveClientLegalStatus,
} from '~/containers/Clients/utils/useClient';

type ClientLegalStatusBadgeProps = {
  readonly legalStatus: Parameters<ResolveClientLegalStatus>['0'];
};

const LegalStatus = styled.span<{ $color: ResolvePayload['color'] }>`
  border-style: solid;
  border-width: 0.1em;
  padding: 0.2em 0.6em;
  border-radius: ${({ theme }) => theme.shape.radiusFactor}em;
  border-color: ${({ $color }) => $color.alpha(0.8).toString()};
  background-color: ${({ $color }) => $color.alpha(0.2).toString()};
  color: ${({ theme, $color }) =>
    theme.isDark ? $color.lighten(30).toString() : $color.darken(100).toString()};
  font-weight: 600;
  font-size: 0.6em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5em;
`;

const ClientLegalStatusBadgeWithRef: React.ForwardRefRenderFunction<
  HTMLSpanElement,
  ClientLegalStatusBadgeProps
> = (props, ref) => {
  const { legalStatus } = props;
  const { resolveClientLegalStatus } = useClient();
  const { color, label } = resolveClientLegalStatus(legalStatus);

  return (
    <LegalStatus $color={color} ref={ref}>
      {label}
    </LegalStatus>
  );
};

const ClientLegalStatusBadge = React.forwardRef(ClientLegalStatusBadgeWithRef);

export default ClientLegalStatusBadge;
