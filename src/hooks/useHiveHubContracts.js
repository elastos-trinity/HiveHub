import Web3 from 'web3';
import { essentialsConnector } from '../service/connectivity';
import { callContractMethod } from '../service/contract';
import {
  getDataFromIpfs,
  uploadAvatar2Ipfs,
  uploadImage2Ipfs,
  uploadNode2Ipfs
} from '../service/ipfs';
import {
  checkHiveNodeStatus,
  getCredentialsFromDID,
  getIPFromDomain,
  getLocationFromIP
} from '../service/fetch';
import { getTime, isInAppBrowser, reduceHexAddress, resolveNameByDidStr } from '../service/common';
import { config } from '../config';

export default function useHiveHubContracts() {
  const walletConnectProvider = isInAppBrowser()
    ? window.elastos.getWeb3Provider()
    : essentialsConnector.getWalletConnectProvider();
  const walletConnectWeb3 = new Web3(walletConnectProvider);

  // TODO: maybe need use other value as the search key.
  // private
  const getHiveNode = async (nodeId, ownerDid) => {
    try {
      const nodeItem = await callContractMethod(walletConnectWeb3, {
        methodName: 'nodeInfo',
        callType: 'call',
        price: '0',
        tokenId: nodeId
      });
      if (!nodeItem) return null;
      const nodeInfo = await getDataFromIpfs(nodeItem.tokenURI || '');
      if (ownerDid && ownerDid !== nodeInfo.creator.did) return null;
      return { ...nodeInfo, nid: nodeItem.tokenId};
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // private
  const getHiveNodes = async (nodeId, ownerDid) => {
    const nodeIds = await callContractMethod(walletConnectWeb3, {
      methodName: 'nodeIds',
      callType: 'call',
      price: '0'
    });
    const nodes = [];
    await Promise.all(
      nodeIds.map(async (_nodeId, index) => {
        if (nodeId && nodeId !== _nodeId) {
          return;
        }
        const node = await getHiveNode(_nodeId, ownerDid);
        if (node) nodes.push(node);
      })
    );
    return nodes;
  };

  // private
  const getHiveNodeDetailByNode = async (item, withName, withStatus, onlyActive) => {
    let created = '';
    if (item?.data?.createdAt) {
      const createdTime = getTime(item.data.createdAt);
      created = `${createdTime.date} ${createdTime.time}`;
    }
    const node = {
      ...item,
      version: item?.version || '',
      type: item?.type || '',
      area: '',
      avatar: item?.data?.avatar || '',
      banner: item?.data?.banner || '',
      created,
      email: item?.data?.email || '',
      ip: '',
      name: item?.name || '',
      ownerName: await reduceHexAddress(item?.creator?.did, 4),
      owner_did: item?.creator?.did || '',
      remark: item?.data?.description || item?.description || '',
      status: false,
      url: item?.data?.endpoint || ''
    };
    try {
      if (withName) {
        const credentials = await getCredentialsFromDID(node.owner_did);
        node.ownerName = credentials.name
          ? credentials.name
          : reduceHexAddress(node.owner_did, 4);
        // get ip and location
        const hostName = node.url.includes('https://')
          ? node.url.replace('https://', '')
          : node.url.replace('http://', '');
        const ipAddress = await getIPFromDomain(hostName);
        if (ipAddress) node.ip = ipAddress;
        const location = await getLocationFromIP(ipAddress, 'json');
        node.area = `${location.country} ${location.region} ${location.city}`;
      }
      if (withStatus) node.status = await checkHiveNodeStatus(node.url);
    } catch (e) {
      console.error(e);
    }
    if (onlyActive && withStatus && !node.status) return null;
    return node;
  };

  const getHiveNodeItem = async (nodeId, ownerDid, withName, withStatus, onlyActive) => {
    const item = await getHiveNode(nodeId, ownerDid);
    if (!item) return null;
    return getHiveNodeDetailByNode(item, withName, withStatus, onlyActive);
  };

  const getHiveNodesList = async (nodeId, ownerId, withName, withStatus, onlyActive) => {
    const nodes = await getHiveNodes(nodeId, ownerId);
    const nodeList = [];
    await Promise.all(
      nodes.map(async (item) => {
        const detail = await getHiveNodeDetailByNode(item, withName, withStatus, onlyActive);
        if (detail) nodeList.push(detail);
      })
    );
    return nodeList;
  };

  const getActiveHiveNodeUrls = async () => {
    const nodes = await getHiveNodes();
    const activeNodes = [];
    await Promise.all(
      nodes.map(async (item) => {
        const node = { ...item };
        try {
          node.status = await checkHiveNodeStatus(node.data.endpoint);
          if (
            node.status &&
            !activeNodes.includes(node.data.endpoint) &&
            ((node.data.endpoint.includes('testnet') && !config.IsProductEnv) ||
              (!node.data.endpoint.includes('testnet') && config.IsProductEnv))
          )
            activeNodes.push(node.data.endpoint);
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
      const avatarRes = await uploadAvatar2Ipfs(nodeInfo.avatar);
      const bannerRes = await uploadImage2Ipfs(nodeInfo.banner);
      const metaRes = await uploadNode2Ipfs(
        nodeInfo.name,
        nodeInfo.ownerDid,
        nodeInfo.description,
        `pasar:image:${avatarRes.path}`,
        bannerRes ? `pasar:image:${bannerRes.path}` : '',
        nodeInfo.email,
        nodeInfo.endpoint,
        nodeInfo.signature,
        nodeInfo.createdAt
      );
      const tokenId =
        parseInt(
          await callContractMethod(walletConnectWeb3, {
            methodName: 'getLastTokenId',
            callType: 'call',
            price: '0'
          }),
          10
        ) + 1;
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
    getHiveNodeItem,
    getHiveNodesList,
    getActiveHiveNodeUrls,
    addHiveNode,
    removeHiveNode
  };
}
