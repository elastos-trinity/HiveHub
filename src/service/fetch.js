import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService,
  AlreadyExistsException
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

export const getHiveVaultInfo = async (did, nodeProvider, type) => {
  try {
    const vaultSubscription =
      type === 1
        ? await getVaultSubscription(did, nodeProvider)
        : await getBackupSubscription(did, nodeProvider);
    const vaultInfo = await vaultSubscription.checkSubscription();
    if (!vaultInfo) return undefined;
    const name = `${type === 1 ? 'Vault' : 'Backup'} Service-0 (${vaultInfo.getPricePlan()})`;
    const total = parseInt(vaultInfo.getStorageQuota() / 1024 / 1024, 10);
    const used = parseInt(vaultInfo.getStorageUsed() / 1024 / 1024, 10);
    const created = getTime(new Date(vaultInfo.getCreated().toString()).getTime());
    const time = `${created.date} ${created.time}`;
    const id = 0;
    const serviceDid = vaultInfo.getServiceDid();
    const credentials = await getCredentialsFromDID(did);
    const ownerName = credentials.name ? credentials.name : reduceHexAddress(did, 4);
    return { id, name, total, used, time, ownerName, serviceDid };
  } catch (e) {
    return undefined;
  }
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

export const getActiveHiveNodeUrl = async () => {
  const nodes = await HiveHubServer.getHiveNodes();
  const activeNodes = [];
  await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      try {
        node.status = await HiveHubServer.isOnline(node.url);
        if (node.status && !activeNodes.includes(node.url)) activeNodes.push(node.url);
      } catch (e) {
        node.status = false;
      }
      return node;
    })
  );
  return activeNodes;
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

export const getVaultSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new VaultSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getBackupSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new BackupSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getSubscriptionService = async (did) => {
  const restService = await getRestService(did);
  return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
};

export const createVault = (did, nodeProvider) =>
  new Promise((resolve, reject) => {
    getVaultSubscription(did, nodeProvider)
      .then((subscription) => subscription.subscribe())
      .then((res) => resolve(true))
      .catch((e) => {
        if (e instanceof AlreadyExistsException) {
          resolve(false);
        } else {
          reject(e);
        }
      });
  });

export const isDIDPublished = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider !== undefined && nodeProvider !== null && nodeProvider !== '';
};

export const getNodeProviderUrl = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider;
};

export const getValidNodeProviderUrl = async (appContext, did) => {
  const nodeProvider = await appContext.getProviderAddress(did);
  // console.log("original: ", nodeProvider)
  const activeNodes = await getActiveHiveNodeUrl();
  // console.log(activeNodes)
  if (!activeNodes.length) return '';
  if (activeNodes.includes(nodeProvider)) return nodeProvider;
  // console.log("updated: ", activeNodes[activeNodes.length - 1])
  return activeNodes[activeNodes.length - 1];
};

// ******************************************************************** //

export const getHiveNodeInfo = async (did) => {
  const restService = await getRestService(did);
  const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};

export const getProvider = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new Provider(appContext, nodeProvider);
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
