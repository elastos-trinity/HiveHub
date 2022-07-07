import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import HiveHubServer from './HiveHubServer';
import SdkContext from './hivejs/testdata';
import { creatAppContext, getAppInstanceDIDDoc } from './HiveService';
import devConfig from './hivejs/config/developing.json';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';

const didResolverUrl = 'https://api-testnet.trinity-tech.cn/eid';
const nodeProvider = 'https://hive-testnet1.trinity-tech.io';

export const getHiveNodesList = async (nid, did) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      node.url = devConfig.node.provider;
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

export const getHiveVaultsList = async () => {
  //   const nodes = await Vault.getLoginUserNodes();
  const testData = await SdkContext.getInstance();
  const vaultSubscription = new VaultSubscription(
    testData.getAppContext(),
    testData.getProviderAddress()
  );
  return vaultSubscription;
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

export const createAppContext = async (did) => {
  const appDIDDoc = await getAppInstanceDIDDoc();
  const appContext = await creatAppContext(appDIDDoc, did);
  return appContext;
};

export const getHiveNodeInfo = async (did) => {
  const appContext = await createAppContext(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(
    serviceEndpoint,
    HttpClient.WITH_AUTHORIZATION,
    HttpClient.DEFAULT_OPTIONS
  );
  const aboutService = new AboutService(appContext, httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};

// ******************************************************************** //

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(didResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
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
  return new Provider(appContext, nodeProvider);
};

export const getVaultSubscription = async (did) => {
  const appContext = await getAppContext(did);
  return new VaultSubscription(appContext, nodeProvider);
};

export const getBackupSubscription = async (did) => {
  const appContext = await getAppContext(did);
  return new BackupSubscription(appContext, nodeProvider);
};

export const getAuthService = async (did) => {
  const restService = await getRestService(did);
  return new AuthService(restService.serviceEndpoint, restService.httpClient);
};

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(didResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};
