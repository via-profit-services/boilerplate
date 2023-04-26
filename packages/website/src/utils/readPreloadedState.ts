const cache: { preloadedStates: Partial<PreloadedStates> | undefined } = {
  preloadedStates: undefined,
};

const readPreloadedState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (typeof cache.preloadedStates !== 'undefined') {
    return cache.preloadedStates;
  }

  const statesStr: string = (window as any).__PRELOADED_STATES__ || '';
  delete (window as any).__PRELOADED_STATES__;
  let preloadedStates: Partial<PreloadedStates> | undefined;
  try {
    preloadedStates = JSON.parse(
      decodeURIComponent(
        window
          .atob(statesStr)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      ),
    ) as Partial<PreloadedStates>;
  } catch (err) {
    console.error('Failed to parse preloaded state');
    console.error(err);
  }

  cache.preloadedStates = {
    REDUX: preloadedStates?.REDUX,
    RELAY: preloadedStates?.RELAY,
  };

  return cache.preloadedStates;
};

export default readPreloadedState;
