import HiveHubServer from './hivehub';
import SdkContext from './hivejs/testdata';
import Vault from './hivejs/vault';

export const getHiveNodesList = async () => {
  const nodes = await HiveHubServer.getHiveNodes();
  const nodeList = await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      node.did = item.owner_did;
      node.status = await HiveHubServer.isOnline(item.url);
      return node;
    })
  );
  return nodeList;
};
