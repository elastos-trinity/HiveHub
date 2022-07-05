import { VaultSubscription, AboutService, ServiceEndpoint, HttpClient } from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import HiveHubServer from './HiveHubServer';
import SdkContext from './hivejs/testdata';
import { creatAppContext, getAppInstanceDIDDoc } from './HiveService';
import devConfig from './hivejs/config/developing.json';

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
  const nodeProvider = "https://hive-testnet1.trinity-tech.io";
  const appContext = await createAppContext(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(serviceEndpoint, true, HttpClient.DEFAULT_OPTIONS);
  const aboutService = new AboutService(appContext, httpClient);
  const nodeInfo = await aboutService.getInfo();
  // const nodeInfo = await serviceEndpoint.getNodeInfo();
  return nodeInfo;
};

