import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { graphql } from 'react-relay';

import LogoutButton from '~/components/Sidebar/LogoutButton';
import { AccountRole } from '~/relay/artifacts/PersonBlockFragment.graphql';

graphql`
  fragment PersonBlockFragment on Query {
    me {
      __typename
      ... on User {
        id
        name
        account {
          roles
        }
      }
    }
  }
`;

graphql`
  subscription PersonBlockSubscription {
    userWasUpdated {
      __typename
      id
      name
      account {
        roles
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const lightStyle = css`
  background: radial-gradient(
    ellipse at center,
    rgba(255, 214, 94, 1) 0%,
    rgba(214, 151, 4, 1) 100%
  );
  color: #212121;
`;

const darkStyle = css`
  background: radial-gradient(rgb(115, 13, 153) 0%, rgb(26, 28, 30) 100%);
  color: #212121;
`;

const TopPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.6rem;
  padding-bottom: 4rem;
  ${({ theme }) => (theme.isDark ? darkStyle : lightStyle)}
`;

const BottomPanel = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
  padding-top: 4rem;
  padding-bottom: 1.25rem;
`;

// const Logo = styled(LogoInline)`
//   height: 1.5rem;
// `;

const Avatar = styled.div`
  position: absolute;
  width: 6rem;
  height: 6rem;
  background: rgb(255 255 255 / 36%);
  left: 50%;
  top: 0;
  transform: translate(-50%, 4rem);
  border-radius: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
`;

const AvatarInner = styled.div`
  position: absolute;
  inset: 4px;
  border-radius: 100%;
  background-color: rgb(239 239 239);
`;

const UserName = styled.div`
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.6em;
`;

const UserRole = styled.div`
  font-size: 0.8em;
  font-weight: 400;
  text-align: center;
  opacity: 0.6;
`;

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly name: string;
  readonly roles: ReadonlyArray<AccountRole>;
}

const PersonBlock: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (props, ref) => {
  const { name, roles } = props;
  // useSubscription(
  //   React.useMemo(
  //     () => ({
  //       subscription,
  //       variables: {},
  //       onNext: () => console.debug('updated'),
  //     }),
  //     [],
  //   ),
  // );

  return (
    <Container {...props} ref={ref}>
      <TopPanel>
        {/* <Logo /> */}
        <LogoutButton />
      </TopPanel>
      <Avatar>
        <AvatarInner />
      </Avatar>
      <BottomPanel>
        <UserName>{name}</UserName>
        <UserRole>{roles.join(', ')}</UserRole>
      </BottomPanel>
    </Container>
  );
};

export default React.forwardRef(PersonBlock);
