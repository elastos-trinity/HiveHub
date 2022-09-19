import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { isInAppBrowser } from '../service/common';
import { essentialsConnector } from '../service/connectivity';
import { callContractMethod } from '../service/contract';
import { uploadNode2Ipfs } from '../service/ipfs';

export default function useHiveHubContracts() {
  const { enqueueSnackbar } = useSnackbar;
  const walletConnectProvider = isInAppBrowser()
    ? window.elastos.getWeb3Provider()
    : essentialsConnector.getWalletConnectProvider();
  const walletConnectWeb3 = new Web3(walletConnectProvider);

  const getHiveNodes = async () => {};

  const addHiveNode = async (nodeInfo) => {
    try {
      const tokenId = await callContractMethod(walletConnectWeb3, {
        methodName: 'totalSupply',
        callType: 'call',
        price: '0'
      });
      const metaRes = await uploadNode2Ipfs(
        nodeInfo.name,
        nodeInfo.created,
        nodeInfo.ip,
        nodeInfo.owner_did,
        nodeInfo.area,
        nodeInfo.email,
        nodeInfo.url,
        nodeInfo.remark
      );
      const tokenUri = `hivehub:json:${metaRes.path}`;
      const nodeEntry = nodeInfo.url;
      const platformInfo = await callContractMethod(walletConnectWeb3, {
        methodName: 'getPlatformFee',
        callType: 'call',
        price: '0'
      });
      console.log(
        `Register Hive Node with tokenId: ${tokenId}, tokenUri: ${tokenUri}, nodeEntry: ${nodeEntry}, registerFee: ${
          platformInfo.platformFee / 1e18
        } ELA`
      );
      await callContractMethod(walletConnectWeb3, {
        methodName: 'mint',
        callType: 'send',
        price: platformInfo.platformFee,
        tokenId,
        tokenUri,
        nodeEntry
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const removeHiveNode = async (tokenId) => {
    try {
      await callContractMethod(walletConnectWeb3, {
        methodName: 'burn',
        callType: 'send',
        price: '0',
        tokenId
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    getHiveNodes,
    addHiveNode,
    removeHiveNode
  };
}
