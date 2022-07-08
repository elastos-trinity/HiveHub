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
import { getTime } from './common';

export const DIDResolverUrl =
  config.network === 'mainnet'
    ? 'https://api.trinity-tech.cn/eid'
    : 'https://api-testnet.trinity-tech.cn/eid';
export const NodeProviderAddress =
  config.network === 'mainnet'
    ? 'https://hive1.trinity-tech.io'
    : 'https://hive-testnet1.trinity-tech.io';

export const getHiveNodesList = async (nid, did) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      // node.url = devConfig.node.provider;
      node.url = NodeProviderAddress;
      try {
        node.status = await HiveHubServer.isOnline(node.url);
      } catch (e) {
        node.status = false;
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
  return { id, name, total, used, time };
};

export const getDIDDocumentFromDID = (did) =>
  new Promise((resolve, reject) => {
    if (!DIDBackend.isInitialized())
      DIDBackend.initialize(new DefaultDIDAdapter('https://api.elastos.io/eid'));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        resolve(didDoc);
        // const credentials = didDoc.getCredentials();
        // const properties = credentials.reduce((props, c) => {
        //   props[c.id.fragment] = c.subject.properties[c.id.fragment];
        //   return props;
        // }, {});
        // resolve(properties);
      })
      .catch((error) => {
        reject(error);
      });
  });

// export const createAppContext = async (did) => {
//   const appDIDDoc = await getAppInstanceDIDDoc();
//   const appContext = await creatAppContext(appDIDDoc, did);
//   return appContext;
// };

export const getHiveNodeInfo = async (did) => {
  const restService = await getRestService(did);
  const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};


// ******************************************************************** //

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(DIDResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, NodeProviderAddress);
  const httpClient = new HttpClient(
    serviceEndpoint,
    HttpClient.WITH_AUTHORIZATION,
    HttpClient.DEFAULT_OPTIONS
  );
  return { serviceEndpoint, httpClient };
};

export const getProvider = async (did) => {
  const appContext = await getAppContext(did);
  return new Provider(appContext, NodeProviderAddress);
};

export const getVaultSubscription = async (did) => {
  const appContext = await getAppContext(did);
  return new VaultSubscription(appContext, NodeProviderAddress);
};

export const getBackupSubscription = async (did) => {
  const appContext = await getAppContext(did);
  return new BackupSubscription(appContext, NodeProviderAddress);
};

export const getAuthService = async (did) => {
  const restService = await getRestService(did);
  return new AuthService(restService.serviceEndpoint, restService.httpClient);
};

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(DIDResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};

export const getSubscriptionService = async (did) => {
  const restService = await getRestService(did);
  return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
};
