import { VaultSubscription } from '@elastosfoundation/hive-js-sdk';
import HiveHubServer from './hivehub';
import SdkContext from './hivejs/testdata';
import Vault from './hivejs/vault';

export const getHiveNodesList = async () => {
  const nodes = await HiveHubServer.getHiveNodes();
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      console.log(node);
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
