import React from 'react';
import { graphql, useFragment, useMutation } from 'react-relay';

import TextField from '@boilerplate/ui-kit/src/TextField';
import fragmentSpec, {
  ContentBlockPlainTextFragment$key,
} from '~/relay/artifacts/ContentBlockPlainTextFragment.graphql';
import updateSpec, {
  ContentBlockPlainTextUpdateMutation,
} from '~/relay/artifacts/ContentBlockPlainTextUpdateMutation.graphql';

export interface ContentBlockPlainTextProps {
  readonly fragmentRef: ContentBlockPlainTextFragment$key | null;
  readonly onUpdate: () => void;
}

const ContentBlockPlainText: React.FC<ContentBlockPlainTextProps> = props => {
  const { fragmentRef, onUpdate } = props;
  const fragment = useFragment(fragmentSpec, fragmentRef);
  const { text, name, id } = fragment || { id: '', text: '', name: '' };
  const [value, setValue] = React.useState(text);
  const lastSavedValueRef = React.useRef(value);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [updateMutation, isPending] = useMutation<ContentBlockPlainTextUpdateMutation>(updateSpec);
  const updateContentBlock = React.useCallback(() => {
    if (value === lastSavedValueRef.current) {
      return;
    }
    lastSavedValueRef.current = value;
    updateMutation({
      variables: {
        id,
        text: value,
        name,
      },
    });
  }, [id, name, updateMutation, value]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <p>
        Content block name: <b>{name}</b>
      </p>
      <div>
        <TextField
          label="Content"
          value={value}
          inputRef={inputRef}
          readOnly={isPending}
          onChange={event => setValue(event.currentTarget.value)}
          onBlur={() => updateContentBlock()}
          onKeyDown={event => {
            if (['Enter', 'NumpadEnter'].includes(event.code)) {
              updateContentBlock();
              onUpdate();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ContentBlockPlainText;

graphql`
  fragment ContentBlockPlainTextFragment on ContentBlockPlainText {
    id
    text
    name
  }
`;

graphql`
  mutation ContentBlockPlainTextUpdateMutation($id: ID!, $text: String!, $name: String) {
    pages {
      updateContentBlockPlainText(id: $id, text: $text, name: $name) {
        __typename
        ... on ContentBlockMutationSuccess {
          contentBlock {
            ...ContentBlockPlainTextFragment
          }
        }
        ... on ContentBlockMutationError {
          name
          msg
        }
      }
    }
  }
`;
