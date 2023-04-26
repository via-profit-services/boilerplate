const formatTime = (ms: number): string => {
  const seconds = (ms / 1000).toFixed(1);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

  switch (true) {
    case Number(seconds) < 60:
      return `${seconds} sec.`;
    case Number(minutes) < 60:
      return `${minutes} min.`;
    case Number(hours) < 24:
      return `${hours} hrs.`;
    default:
      return `${days} days`;
  }
};

export default formatTime;
