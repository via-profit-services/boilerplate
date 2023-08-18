export const convertGMT = (timeZone: string, date = new Date()): string => {
  const currentTimeInAnyTimezone = new Date(date.toLocaleString('en', { timeZone }));

  const timeDiff = date.getTime() - currentTimeInAnyTimezone.getTime();
  const hoursOffset = timeDiff / 1000 / 60 / 60;
  const sourceUTCOffset = Number(
    date.toLocaleString('en', { timeZoneName: 'short' }).split('GMT')[1],
  );

  const offset = sourceUTCOffset - hoursOffset;

  const newGMT = offset > 0 ? `+${offset}` : `${offset}`;

  return `${date.toLocaleString('en', { timeZoneName: 'short' }).split('GMT')[0]} GMT ${newGMT}`;
};

export default convertGMT;
