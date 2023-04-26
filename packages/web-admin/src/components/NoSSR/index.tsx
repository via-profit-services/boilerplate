import * as React from 'react';

interface NoSSRProps {
  children: React.ReactNode | React.ReactNode[];
  fallback?: React.ReactNode | React.ReactNode[];
}

const NoSSR: React.FC<NoSSRProps> = props => {
  const { fallback, children } = props;
  const [mountedState, setMountedState] = React.useState(false);

  React.useEffect(() => {
    setMountedState(true);
  }, []);

  return mountedState ? <>{children}</> : <>{fallback ? fallback : null}</>;
};

export default NoSSR;
