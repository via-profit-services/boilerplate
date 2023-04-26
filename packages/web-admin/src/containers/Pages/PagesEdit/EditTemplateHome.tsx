import React from 'react';
import { graphql, useFragment } from 'react-relay';

import Meta from '~/components/Meta';
import fragmentSpec, {
  EditTemplateHomeFragment$key,
} from '~/relay/artifacts/EditTemplateHomeFragment.graphql';
import ContentBlock from '~/components/ContentBlock';

interface EditTemplateHomeProps {
  readonly templateFragment: EditTemplateHomeFragment$key;
}

const EditTemplateHome: React.FC<EditTemplateHomeProps> = props => {
  const { templateFragment } = props;
  const { page, displayName, heading } = useFragment(fragmentSpec, templateFragment);

  return (
    <>
      <Meta header={`Page / ${page.name} / ${displayName}`} />

      <div>
        <p>
          Edit Template <b>{displayName}</b> of page <b>{page.name}</b>
        </p>
        <p>Heading:</p>
        <div>
          <ContentBlock fragmentRef={heading} />
        </div>
      </div>
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
    heading {
      __typename
      ...ContentBlockFragment
    }
    slider {
      slides {
        image {
          id
          file {
            url
          }
        }
      }
    }
  }
`;
