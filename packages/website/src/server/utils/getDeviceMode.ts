import http from 'node:http';

export const getDeviceModeByRequest = (
  req: http.IncomingMessage,
): ReduxStore['ui']['device'] => {
  const { headers } = req;
  const userAgent = headers?.['user-agent'] || '';

  switch (true) {
    case /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent):
      return 'tablet';

    case /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      userAgent,
    ):
      return 'mobile';

    default:
      return 'desktop';
  }
};

export default getDeviceModeByRequest;
