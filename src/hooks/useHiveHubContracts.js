import Web3 from 'web3';
import { createHash } from 'crypto';
import { essentialsConnector } from '../service/connectivity';
import { callContractMethod } from '../service/contract';
import { getDataFromIpfs, uploadAvatar2Ipfs, uploadNode2Ipfs } from '../service/ipfs';
import { checkHiveNodeStatus, getCredentialsFromDID } from '../service/fetch';
import { isInAppBrowser, reduceHexAddress } from '../service/common';
import { config } from '../config';

export default function useHiveHubContracts() {
  const walletConnectProvider = isInAppBrowser()
    ? window.elastos.getWeb3Provider()
    : essentialsConnector.getWalletConnectProvider();
  const walletConnectWeb3 = new Web3(walletConnectProvider);

  const getHiveNodes = async (nodeId, ownerDid) => {
    const nodeIds = await callContractMethod(walletConnectWeb3, {
      methodName: 'nodeIds',
      callType: 'call',
      price: '0'
    });
    const nodes = [];
    await Promise.all(
      nodeIds.map(async (_, index) => {
        try {
          const nodeItem = await callContractMethod(walletConnectWeb3, {
            methodName: 'nodeByIndex',
            callType: 'call',
            price: '0',
            index
          });
          const nodeInfo = await getDataFromIpfs(nodeItem.tokenURI || '');
          let isMatched = true;
          if (nodeId) {
            if (nodeItem.tokenId !== nodeId) {
              isMatched = false;
            }
          }
          if (ownerDid) {
            if (ownerDid !== nodeInfo.owner_did) {
              isMatched = false;
            }
          }
          if (isMatched) nodes.push({ ...nodeInfo, nid: nodeItem.tokenId });
        } catch (err) {
          console.error(err);
        }
      })
    );
    return nodes;
  };

  const getHiveNodesList = async (nid, did, withName, withStatus, onlyActive) => {
    const nodes = await getHiveNodes(nid, did);
    const nodeList = [];
    await Promise.all(
      nodes.map(async (item) => {
        const node = { ...item };
        try {
          if (withName) {
            const credentials = await getCredentialsFromDID(node.owner_did);
            node.ownerName = credentials.name
              ? credentials.name
              : reduceHexAddress(node.owner_did, 4);
          } else {
            node.ownerName = reduceHexAddress(node.owner_did, 4);
          }
          if (withStatus) node.status = await checkHiveNodeStatus(node.url);
          else node.status = false;
        } catch (e) {
          node.status = false;
          node.ownerName = reduceHexAddress(node.owner_did, 4);
        }
        if (onlyActive) {
          if (node.status) nodeList.push(node);
        } else nodeList.push(node);
        return node;
      })
    );
    return nodeList;
  };

  const getActiveHiveNodeUrl = async () => {
    const nodes = await getHiveNodes();
    const activeNodes = [];
    await Promise.all(
      nodes.map(async (item) => {
        const node = { ...item };
        try {
          node.status = await checkHiveNodeStatus(node.url);
          if (
            node.status &&
            !activeNodes.includes(node.url) &&
            ((node.url.includes('testnet') && !config.IsProductEnv) ||
              (!node.url.includes('testnet') && config.IsProductEnv))
          )
            activeNodes.push(node.url);
        } catch (e) {
          node.status = false;
        }
        return node;
      })
    );
    return activeNodes;
  };

  const addHiveNode = async (nodeInfo) => {
    try {
      const imgRes = await uploadAvatar2Ipfs(nodeInfo.avatar);
      const metaRes = await uploadNode2Ipfs(
        nodeInfo.name,
        nodeInfo.ownerDid,
        nodeInfo.description,
        `pasar:image:${imgRes.path}`,
        nodeInfo.email,
        nodeInfo.endpoint,
        nodeInfo.signature,
        nodeInfo.createdAt
      );
      const tokenId = `0x${createHash('sha256').update(metaRes.path).digest('hex')}`;
      const tokenUri = `hivehub:json:${metaRes.path}`;
      const nodeEntry = nodeInfo.endpoint;
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
    getHiveNodesList,
    getActiveHiveNodeUrl,
    addHiveNode,
    removeHiveNode
  };
}
