import React from 'react';
import { graphql, useFragment } from 'react-relay';
import styled from '@emotion/styled';

import Meta from '~/components/Meta';
import fragmentSpec, {
  EditTemplateHomeFragment$key,
} from '~/relay/artifacts/EditTemplateHomeFragment.graphql';
import TemplateMockupHome from '~/components/TemplateMockupHome';
import ContentArea from '~/components/ContentArea';
import Card from '~/components/Card';

interface EditTemplateHomeProps {
  readonly fragmentRef: EditTemplateHomeFragment$key;
}

const StyledTemplateMockup = styled(TemplateMockupHome)`
  flex: 1;
  width: 100%;
`;

const EditTemplateHome: React.FC<EditTemplateHomeProps> = props => {
  const { fragmentRef } = props;
  const tempalteFragment = useFragment(fragmentSpec, fragmentRef);
  const { page, displayName } = tempalteFragment;

  return (
    <>
      <Meta header={`Page / ${page.name} / ${displayName}`} />
      <ContentArea>
        <Card>
          {page.name} <b>{displayName}</b>
        </Card>
        <StyledTemplateMockup fragmentRef={tempalteFragment} />
      </ContentArea>
    </>
  );
};

export default EditTemplateHome;

graphql`
  fragment EditTemplateHomeFragment on TemplateHomePage {
    id
    displayName
    page {
      id
      name
    }
    ...TemplateMockupHomeFragment
  }
`;
