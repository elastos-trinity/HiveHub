import config from '../config';

export const isInAppBrowser = () =>
  window.elastos !== undefined && window.elastos.name === 'essentialsiab';

export const isProductEnv = () => config.network === 'mainnet';

export const isSupportedNetwork = (chainId) =>
  (isProductEnv() && chainId === 20) || (!isProductEnv() && chainId === 21);

// Get time from timestamp // yyyy/MM/dd hh:mm
export const getTime = (timestamp) => {
  const date = new Date(parseInt(timestamp, 10));
  // const dateStr = date.toISOString().slice(0, 10).replaceAll('-', '/');
  const dateString = date.toLocaleDateString('en-US');
  const dateStrs = dateString.split('/');
  const dateStr = `${dateStrs[2]}-${dateStrs[0]}-${dateStrs[1]}`;
  const hours = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const timeStr = [hours, min, seconds].join(':');
  return { date: dateStr, time: timeStr };
};
