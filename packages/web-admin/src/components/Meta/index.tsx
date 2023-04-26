import * as React from 'react';
import { Context } from './reducer';

interface ApplicationMetaProps {
  header?: string;
  children?: React.ReactNode;
}

export const ApplicationMeta: React.FC<ApplicationMetaProps> = props => {
  const { header, children } = props;
  const { dispatch } = React.useContext(Context);

  React.useEffect(() => {
    dispatch({
      type: 'set',
      payload: {
        header,
        content: children,
      },
    });
  }, [header, dispatch, children]);

  return null;
};

export default React.memo(ApplicationMeta);
