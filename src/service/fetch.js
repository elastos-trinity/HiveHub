import { VaultSubscription } from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import HiveHubServer from './hivehub';
import SdkContext from './hivejs/testdata';
import Vault from './hivejs/vault';

export const getHiveNodesList = async (nid, did) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      node.did = item.owner_did;
      node.url = 'https://hive-testnet1.trinity-tech.io';
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
