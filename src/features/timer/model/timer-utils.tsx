export const formatElapsed = (ms: number) => {
  const totalCs = Math.floor(ms / 10);
  const minutes = Math.floor(totalCs / 6000);
  const seconds = Math.floor((totalCs % 6000) / 100);
  const getTime = (n: number) => String(n).padStart(2, '0');

  return `${getTime(minutes)}:${getTime(seconds)}`;
};
