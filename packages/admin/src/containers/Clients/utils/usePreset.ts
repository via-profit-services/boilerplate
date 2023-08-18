import React from 'react';
import { useParams } from 'react-router-dom';

import useContext, { State } from '../ClientsList/useContext';

export type PresetName = 'active' | 'inactive' | 'all';
type RouteParams = {
  readonly preset?: PresetName;
};

export type usePresetResponse = {
  readonly variables: State['variables'];
  readonly presetName: PresetName;
};

export type UsePreset = () => usePresetResponse;
export const usePreset: UsePreset = () => {
  const { preset } = useParams<RouteParams>();
  const { state } = useContext();

  const { variables, presetName } = React.useMemo(() => {
    const vars: State['variables'] = { ...state.variables };
    switch (preset) {
      case 'active':
        vars.status = ['ACTIVE'];
        break;
      case 'inactive':
        vars.status = ['INACTIVE'];
        break;
      case 'all':
        vars.status = null;
        break;
      default:
        break;
    }

    return {
      variables: vars,
      presetName: preset || 'all',
    };
  }, [state.variables, preset]);

  const result: ReturnType<UsePreset> = {
    variables,
    presetName,
  };

  return result;
};

export default usePreset;
