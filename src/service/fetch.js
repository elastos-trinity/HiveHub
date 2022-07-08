import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import HiveHubServer from './HiveHubServer';
// import { creatAppContext, getAppInstanceDIDDoc } from './HiveService';
// import devConfig from './hivejs/config/developing.json';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import config from '../config';
import { getTime, reduceHexAddress } from './common';

export const getHiveNodesList = async (nid, did, withName) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      // node.url = config.NodeProviderUrl;
      try {
        if (withName) {
          const credentials = await getCredentialsFromDID(node.owner_did);
          node.ownerName = credentials.name
            ? credentials.name
            : reduceHexAddress(node.owner_did, 4);
        } else {
          node.ownerName = reduceHexAddress(node.owner_did, 4);
        }
        node.status = await HiveHubServer.isOnline(node.url);
      } catch (e) {
        node.status = false;
        node.ownerName = reduceHexAddress(node.owner_did, 4);
      }
      return node;
    })
  );
  return nodeList;
};

export const getHiveVaultInfo = async (did) => {
  const subscriptionService = await getSubscriptionService(did);
  const vaultInfo = await subscriptionService.getVaultInfo();
  if (!vaultInfo) return undefined;
  const name = `Vault Service-0 (${vaultInfo.getPricePlan()})`;
  const total = parseInt(vaultInfo.getStorageQuota() / 1024 / 1024, 10);
  const used = parseInt(vaultInfo.getStorageUsed() / 1024 / 1024, 10);
  const created = getTime(new Date(vaultInfo.getCreated().toString()).getTime());
  const time = `${created.date} ${created.time}`;
  const id = 0;
  const serviceDid = vaultInfo.getServiceDid();
  const credentials = await getCredentialsFromDID(did);
  const ownerName = credentials.name ? credentials.name : reduceHexAddress(did, 4);
  return { id, name, total, used, time, ownerName, serviceDid };
};

export const getDIDDocumentFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        resolve(didDoc);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCredentialsFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        const credentials = didDoc.getCredentials();
        const properties = credentials.reduce((props, c) => {
          props[c.id.fragment] = c.subject.properties[c.id.fragment];
          return props;
        }, {});
        resolve(properties);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getHiveNodeInfo = async (did) => {
  const restService = await getRestService(did);
  const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};

// ******************************************************************** //

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(
    serviceEndpoint,
    HttpClient.WITH_AUTHORIZATION,
    HttpClient.DEFAULT_OPTIONS
  );
  return { serviceEndpoint, httpClient };
};

export const getProvider = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new Provider(appContext, nodeProvider);
};

export const getVaultSubscription = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new VaultSubscription(appContext, nodeProvider);
};

export const getBackupSubscription = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new BackupSubscription(appContext, nodeProvider);
};

export const getAuthService = async (did) => {
  const restService = await getRestService(did);
  return new AuthService(restService.serviceEndpoint, restService.httpClient);
};

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};

export const getSubscriptionService = async (did) => {
  const restService = await getRestService(did);
  return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
};
