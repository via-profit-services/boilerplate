import React from 'react';
import styled from '@emotion/styled';

import useClient, {
  ResolvePayload,
  ResolveClientStatus,
} from '~/containers/Clients/utils/useClient';

type ClientStatusBadgeProps = {
  readonly status: Parameters<ResolveClientStatus>['0'];
};

const Status = styled.span<{ $color: ResolvePayload['color'] }>`
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

const ClientStatusBadgeWithRef: React.ForwardRefRenderFunction<
  HTMLSpanElement,
  ClientStatusBadgeProps
> = (props, ref) => {
  const { status } = props;
  const { resolveClientStatus } = useClient();
  const { color, label } = resolveClientStatus(status);

  return (
    <Status $color={color} ref={ref}>
      {label}
    </Status>
  );
};

const ClientStatusBadge = React.forwardRef(ClientStatusBadgeWithRef);

export default ClientStatusBadge;
