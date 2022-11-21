import { NODE_REGISTRY_ABI } from '../contracts/NodeRegistry';
import { config } from '../config';

export const callContractMethod = async (web3, param) => {
  let contractMethod = null;
  let accounts = [];
  let gasPrice = '';
  if (!NODE_REGISTRY_ABI || !config.NodeRegistryAddress) return;
  const HiveHubContract = new web3.eth.Contract(NODE_REGISTRY_ABI, config.NodeRegistryAddress);
  switch (param.methodName) {
    case 'mint':
      contractMethod = HiveHubContract.methods.mint(param.tokenUri, param.nodeEntry);
      break;
    case 'getLastTokenId':
      contractMethod = HiveHubContract.methods.getLastTokenId();
      break;
    case 'getPlatformFee':
      contractMethod = HiveHubContract.methods.getPlatformFee();
      break;
    case 'nodeIds':
      contractMethod = HiveHubContract.methods.nodeIds();
      break;
    case 'nodeByIndex':
      contractMethod = HiveHubContract.methods.nodeByIndex(param.index);
      break;
    case 'nodeInfo':
      contractMethod = HiveHubContract.methods.nodeInfo(param.tokenId);
      break;
    case 'burn':
      contractMethod = HiveHubContract.methods.burn(param.tokenId);
      break;
    default:
      throw Error('Invalid contract method name;');
  }

  if (param.callType === 'call') {
    return contractMethod.call();
  }

  if (param.callType === 'send') {
    return new Promise((resolve, reject) => {
      const handleTxEvent = (hash) => {
        console.log('transactionHash', hash);
      };
      const handleReceiptEvent = (receipt) => {
        console.log('receipt', receipt);
        resolve();
      };
      const handleErrorEvent = (error) => {
        console.error('error', error);
        reject(error);
      };

      web3.eth
        .getAccounts()
        .then((_accounts) => {
          accounts = _accounts;
          return web3.eth.getGasPrice();
        })
        .then(async (_gasPrice) => {
          gasPrice = parseInt(_gasPrice, 10) > 20 * 1e9 ? (20 * 1e9).toString() : _gasPrice;
          return contractMethod.estimateGas({
            from: accounts[0],
            gas: 8000000,
            value: param.price
          });
        })
        .then((_estimatedGas) => {
          const gasLimit = parseInt((_estimatedGas * 1.5).toString(), 10);
          const transactionParams = {
            from: accounts[0],
            gasPrice,
            gas: gasLimit > 8000000 ? 8000000 : gasLimit,
            value: param.price
          };
          contractMethod
            .send(transactionParams)
            .once('transactionHash', handleTxEvent)
            .once('receipt', handleReceiptEvent)
            .on('error', handleErrorEvent);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  throw Error('Not implemented');
};
