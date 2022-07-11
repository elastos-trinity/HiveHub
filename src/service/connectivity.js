import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import config from '../config';

export const essentialsConnector = new EssentialsConnector();
let connectivityInitialized = false;

export function initConnectivitySDK() {
  if (connectivityInitialized) return;
  
  // unregistear if already registerd
  const arrIConnectors = connectivity.getAvailableConnectors();
  if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
    connectivity.unregisterConnector(essentialsConnector.name);
  }
  // register connector
  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivity.setApplicationDID(config.ApplicationDID);
    connectivityInitialized = true;
    const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
    // Restore the wallet connect session - TODO: should be done by the connector itself?
    if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
      essentialsConnector.getWalletConnectProvider().enable();
  });
}

export function isUsingEssentialsConnector() {
  const activeConnector = connectivity.getActiveConnector();
  if (!activeConnector) return false;
  return activeConnector && activeConnector.name === essentialsConnector.name;
}
