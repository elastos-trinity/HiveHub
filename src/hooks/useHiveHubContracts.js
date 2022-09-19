import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { isInAppBrowser } from '../service/common';
import { essentialsConnector } from '../service/connectivity';
import { callContractMethod } from '../service/contract';

export default function useHiveHubContracts() {
  const { enqueueSnackbar } = useSnackbar;
  const walletConnectProvider = isInAppBrowser()
    ? window.elastos.getWeb3Provider()
    : essentialsConnector.getWalletConnectProvider();
  const walletConnectWeb3 = new Web3(walletConnectProvider);

  const getHiveNodes = async () => {};
  const addHiveNode = async (tokenId, tokenUri, nodeEntry) => {
    const platformInfo = await callContractMethod(walletConnectWeb3, {
      methodName: 'getPlatformFee',
      callType: 'call',
      price: '0'
    });
    await callContractMethod(walletConnectWeb3, {
      methodName: 'mint',
      callType: 'send',
      price: platformInfo.platformFee,
      tokenId,
      tokenUri,
      nodeEntry
    });
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
    callContractMethod,
    getHiveNodes,
    addHiveNode,
    removeHiveNode
  };
}
