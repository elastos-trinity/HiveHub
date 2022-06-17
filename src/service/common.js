export const isInAppBrowser = () =>
  window.elastos !== undefined && window.elastos.name === 'essentialsiab';

export const isProductEnv = () => true;

export const isSupportedNetwork = (chainId) =>
  (isProductEnv() && chainId === 20) || (!isProductEnv() && chainId === 21);
