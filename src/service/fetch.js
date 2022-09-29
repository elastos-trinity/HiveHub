import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService,
  AlreadyExistsException,
  Vault,
  // NotFoundException,
  InsertOptions,
  BackupResultResult,
  HiveException,
  Backup
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
// import HiveHubServer from './HiveHubServer';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import { config } from '../config';
import { checkIfValidIP, getTime, reduceHexAddress, sleep } from './common';

// ******************************* Hive Node (HiveHub Server) ************************************* //

// export const createHiveNode = async (node) => {
//   try {
//     const response = await HiveHubServer.addHiveNode(node);
//     return response ? response.inserted_id : '';
//   } catch (err) {
//     console.error(err);
//     return '';
//   }
// };

// export const removeHiveNode = async (nid) => {
//   if (!nid) return false;
//   const ret = await HiveHubServer.removeHiveNode(nid);
//   return ret === true;
// };

// deprecated
// export const checkHiveNodeStatus = async (url) => {
//   const status = await HiveHubServer.isOnline(url);
//   return status;
// };

export const checkHiveNodeStatus = async (nodeUrl) => {
  const url = `${nodeUrl}/api/v2/about/version`;
  try {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin' // include, *same-origin, omit
    });
    return response.status >= 200 && response.status < 300;
  } catch (e) {
    return false;
  }
};

// deprecated
// export const getHiveNodesList = async (nid, did, withName, withStatus, onlyActive) => {
//   const nodes = await HiveHubServer.getHiveNodes(nid, did);
//   const nodeList = [];
//   await Promise.all(
//     nodes.map(async (item) => {
//       const node = { ...item };
//       try {
//         if (withName) {
//           const credentials = await getCredentialsFromDID(node.owner_did);
//           node.ownerName = credentials.name
//             ? credentials.name
//             : reduceHexAddress(node.owner_did, 4);
//         } else {
//           node.ownerName = reduceHexAddress(node.owner_did, 4);
//         }
//         if (withStatus) node.status = await HiveHubServer.isOnline(node.url);
//         else node.status = false;
//       } catch (e) {
//         node.status = false;
//         node.ownerName = reduceHexAddress(node.owner_did, 4);
//       }
//       if (onlyActive) {
//         if (node.status) nodeList.push(node);
//       } else nodeList.push(node);
//       return node;
//     })
//   );
//   return nodeList;
// };

// deprecated
// export const getActiveHiveNodeUrl = async () => {
//   const nodes = await HiveHubServer.getHiveNodes();
//   const activeNodes = [];
//   await Promise.all(
//     nodes.map(async (item) => {
//       const node = { ...item };
//       try {
//         node.status = await HiveHubServer.isOnline(node.url);
//         if (
//           node.status &&
//           !activeNodes.includes(node.url) &&
//           ((node.url.includes('testnet') && !config.IsProductEnv) ||
//             (!node.url.includes('testnet') && config.IsProductEnv))
//         )
//           activeNodes.push(node.url);
//       } catch (e) {
//         node.status = false;
//       }
//       return node;
//     })
//   );
//   return activeNodes;
// };

export const getHiveNodeInfo = async (did, nodeProvider) => {
  try {
    const restService = await getRestService(did, nodeProvider);
    const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
    const nodeInfo = await aboutService.getInfo();
    return nodeInfo;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getMyHiveNodeDetails = async (did, nodeProviderUrl) => {
  try {
    const provider = await getProvider(did, nodeProviderUrl);
    const vaults = await provider.getVaults();
    const backups = await provider.getBackups();
    return { vaults, backups };
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getHiveVaultInfo = async (did, nodeProvider, type) => {
  try {
    const vaultSubscription =
      type === 1
        ? await getVaultSubscription(did, nodeProvider)
        : await getBackupSubscription(did, nodeProvider);
    const vaultInfo = await vaultSubscription.checkSubscription();
    if (!vaultInfo) return undefined;
    const name = `${type === 1 ? 'Vault' : 'Backup'} Service-0 (${vaultInfo.getPricePlan()})`;
    const total = parseInt(vaultInfo.getStorageQuota() / 1024 / 1024, 10);
    const used = parseInt(vaultInfo.getStorageUsed() / 1024 / 1024, 10);
    const created = getTime(new Date(vaultInfo.getCreated().toString()).getTime());
    const time = `${created.date} ${created.time}`;
    const id = 0;
    const serviceDid = vaultInfo.getServiceDid();
    const credentials = await getCredentialsFromDID(did);
    const ownerName = credentials.name ? credentials.name : reduceHexAddress(did, 4);
    return { id, name, total, used, time, ownerName, serviceDid };
  } catch (e) {
    return undefined;
  }
};

// ******************************* HIVE-JS-SDK ************************************* //

export const getAppContext = async (did) => {
  try {
    const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
    const appContext = await instBCSHAH.getAppContext(did);
    return appContext;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getRestService = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    const serviceEndpoint = new ServiceEndpoint(appContext, nodeProviderUrl || nodeProvider);
    const httpClient = new HttpClient(
      serviceEndpoint,
      HttpClient.WITH_AUTHORIZATION,
      HttpClient.DEFAULT_OPTIONS
    );
    return { serviceEndpoint, httpClient };
  } catch (err) {
    console.error(err);
    return { serviceEndpoint: undefined, httpClient: undefined };
  }
};

export const getProvider = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    return new Provider(appContext, nodeProviderUrl || nodeProvider);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getVaultSubscription = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    return new VaultSubscription(appContext, nodeProviderUrl || nodeProvider);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getBackupSubscription = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    return new BackupSubscription(appContext, nodeProviderUrl || nodeProvider);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getSubscriptionService = async (did) => {
  try {
    const restService = await getRestService(did, undefined);
    return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const createVault = (did, nodeProvider) =>
  new Promise((resolve, reject) => {
    getVaultSubscription(did, nodeProvider)
      .then((subscription) => subscription.subscribe())
      // eslint-disable-next-line no-unused-vars
      .then((_) => resolve(true))
      .catch((e) => {
        if (e instanceof AlreadyExistsException) {
          resolve(false);
        } else {
          reject(e);
        }
      });
  });

export const destroyVault = async (did) => {
  try {
    const vaultSubscription = await getVaultSubscription(did, undefined);
    await vaultSubscription.unsubscribe();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const isDIDUnbinded = async (did) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    return nodeProvider !== undefined || nodeProvider !== null || nodeProvider !== '';
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getNodeProviderUrl = async (did) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    return nodeProvider;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getAuthService = async (did) => {
  try {
    const restService = await getRestService(did, undefined);
    return new AuthService(restService.serviceEndpoint, restService.httpClient);
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getVault = async (did) => {
  try {
    const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
    const vault = await instBCSHAH.getVaultServices(did);
    return vault;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

// ******************************* Test ************************************* //

export const insertData = async (did) => {
  const COLLECTION_NAME = 'test_collection';
  const vault = await getVault(did);
  const databaseService = vault.getDatabaseService();
  try {
    await databaseService.createCollection(COLLECTION_NAME);
  } catch (e) {
    console.log(e);
  }
  const doc = { author: 'john doe1', title: 'Eve for Dummies1' };
  await databaseService.insertOne(COLLECTION_NAME, doc, new InsertOptions(false, false));
  console.log('a new document is been inserted.');
};

export const getStoredData = async (did) => {
  try {
    const COLLECTION_NAME = 'test_collection';
    const query = { author: 'john doe1' };
    const vault = await getVault(did);
    const databaseService = vault.getDatabaseService();
    try {
      const result = await databaseService.findOne(COLLECTION_NAME, query);
      return result;
    } catch (e) {
      console.log(e);
      return '';
    }
  } catch (err) {
    console.error(err);
  }
};

// ******************************* Basic Feature (backup, migrate, unbind) ************************************* //

// TODO: Find available backup node
export const findBackupNodeProvider = async (did) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    if (nodeProvider.includes('1')) return nodeProvider.replace('1', '2');
    return nodeProvider.replace('2', '1');
  } catch (err) {
    console.error(err);
  }
};

export const checkBackupStatus = async (did) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    const vaultInfo = await getHiveVaultInfo(did, undefined, 1);
    if (vaultInfo) {
      const vault = new Vault(appContext, nodeProvider);
      const backupService = vault.getBackupService(vault);
      const info = await backupService.checkResult();
      return info.getResult() === BackupResultResult.RESULT_SUCCESS;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const backupVault = async (did, targetNodeUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    // Vault to back up
    const vault = new Vault(appContext, nodeProvider);
    const vaultSubscription = new VaultSubscription(appContext, nodeProvider);
    const backupService = vault.getBackupService();
    // Backup Service on target Node
    const targetBackupSubscription = new BackupSubscription(appContext, targetNodeUrl);
    // subscribe the backup service
    try {
      await targetBackupSubscription.subscribe();
    } catch (err) {
      if (err instanceof AlreadyExistsException) {
        await targetBackupSubscription.unsubscribe();
        await targetBackupSubscription.subscribe();
      } else {
        console.error(err);
        return 0;
      }
    }
    console.log('subscribe a backup service.');
    const targetBackupInfo = await targetBackupSubscription.checkSubscription();
    const targetBackupServiceDid = targetBackupInfo.getServiceDid();
    backupService.setBackupContext({
      getParameter(parameter) {
        switch (parameter) {
          case 'targetAddress':
            return targetNodeUrl;
          case 'targetServiceDid':
            return targetBackupServiceDid;
          default:
            break;
        }
        return null;
      },
      getType() {
        return null;
      },
      async getAuthorization(srcDid, targetDid, targetHost) {
        try {
          const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
          // TODO: EE return wrong format credential, just place a correct one to make demo work.
          const token = await instBCSHAH.getBackupCredential(srcDid, targetDid, targetHost);
          return token;
          // return '{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#hive-backup-credential","type":["HiveBackupCredential","VerifiableCredential"],"issuer":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq","issuanceDate":"2022-06-30T02:58:05Z","expirationDate":"2027-06-30T02:58:05Z","credentialSubject":{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","sourceHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetNodeURL":"http://localhost:5005"},"proof":{"type":"ECDSAsecp256r1","created":"2022-06-30T02:58:06Z","verificationMethod":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq#primary","signature":"4IFGnkBb9drcsD4V0GHlHZ5bSaO1CO0c69-k9d5yhTZvbEqnyXncNKhNLvKs2yaNk1ARgj6o1gUIDc74moNxWA"}}';
        } catch (e) {
          throw new HiveException(e.toString());
        }
      }
    });

    // deactivate the vault to avoid data changes in the backup process.
    await vaultSubscription.deactivate();
    console.log('deactivate the source vault.');

    // backup the vault data.
    await backupService.startBackup();

    // wait backup end.
    let count = 0;
    while (count < 30) {
      // eslint-disable-next-line no-await-in-loop
      const info = await backupService.checkResult();
      if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
        // go on.
      } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
        return 1;
      } else {
        console.error(`failed to backup: ${info.getMessage()}`);
        return 0;
      }
      count += 1;
      console.log('backup in process, try to wait.');
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
    console.log('backup done.');
    return 0;
  } catch (e) {
    if (e instanceof AlreadyExistsException) return 2;
    console.error(e);
    return 0;
  }
};

/**
 * This example shows how to migrate the vault to another node,
 * here two nodes are same.
 *
 * The process of migration:
 *
 *      1. create a vault (migration source) and input some data and files on node A.
 *      2. subscribe a backup service on node B.
 *      3. deactivate the vault, then execute backup on node A to node B.
 *      4. make sure no vault on node B and promote the backup data to a new vault.
 *      5. update the user DID info. on chain with node B url.
 *      6. unsubscribe the vault on node A.
 *      7. all done. the vault can be used on node B.
 *
 */

export const migrateVault = async (did, targetNodeUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    // Vault to back up
    const vault = new Vault(appContext, nodeProvider);
    const vaultSubscription = new VaultSubscription(appContext, nodeProvider);
    const backupService = vault.getBackupService();
    // Remove vault on target node
    const targetVaultSubscription = new VaultSubscription(appContext, targetNodeUrl);
    try {
      const targetVaultInfo = await targetVaultSubscription.checkSubscription();
      if (targetVaultInfo) await targetVaultSubscription.unsubscribe();
    } catch (err) {
      console.error(err);
    }
    // Backup Service on target Node
    const targetBackupSubscription = new BackupSubscription(appContext, targetNodeUrl);
    // subscribe the backup service
    try {
      await targetBackupSubscription.subscribe();
    } catch (err) {
      if (err instanceof AlreadyExistsException) {
        await targetBackupSubscription.unsubscribe();
        await targetBackupSubscription.subscribe();
      } else {
        console.error(err);
        return 0;
      }
    }
    console.log('subscribe a backup service.');
    const targetBackupInfo = await targetBackupSubscription.checkSubscription();
    const targetBackupServiceDid = targetBackupInfo.getServiceDid();
    backupService.setBackupContext({
      getParameter(parameter) {
        switch (parameter) {
          case 'targetAddress':
            return targetNodeUrl;
          case 'targetServiceDid':
            return targetBackupServiceDid;
          default:
            break;
        }
        return null;
      },
      getType() {
        return null;
      },
      async getAuthorization(srcDid, targetDid, targetHost) {
        try {
          const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
          // TODO: EE return wrong format credential, just place a correct one to make demo work.
          const token = await instBCSHAH.getBackupCredential(srcDid, targetDid, targetHost);
          return token;
          // return '{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#hive-backup-credential","type":["HiveBackupCredential","VerifiableCredential"],"issuer":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq","issuanceDate":"2022-06-30T02:58:05Z","expirationDate":"2027-06-30T02:58:05Z","credentialSubject":{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","sourceHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetNodeURL":"http://localhost:5005"},"proof":{"type":"ECDSAsecp256r1","created":"2022-06-30T02:58:06Z","verificationMethod":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq#primary","signature":"4IFGnkBb9drcsD4V0GHlHZ5bSaO1CO0c69-k9d5yhTZvbEqnyXncNKhNLvKs2yaNk1ARgj6o1gUIDc74moNxWA"}}';
        } catch (e) {
          throw new HiveException(e.toString());
        }
      }
    });

    // deactivate the vault to a void data changes in the backup process.
    await vaultSubscription.deactivate();
    console.log('deactivate the source vault.');

    // backup the vault data.
    await backupService.startBackup();

    // wait backup end.
    let count = 0;
    while (count < 30) {
      // eslint-disable-next-line no-await-in-loop
      const info = await backupService.checkResult();
      if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
        // go on.
      } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
        break;
      } else {
        throw new Error(`failed to backup: ${info.getMessage()}`);
      }
      count += 1;
      console.log('backup in process, try to wait.');
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
    console.log('backup done.');

    // promotion, same vault, so need remove vault first.
    await vaultSubscription.unsubscribe();

    // promote
    const backup = new Backup(appContext, targetNodeUrl);
    await backup.getPromotionService().promote();
    console.log('promotion over from backup data to a new vault.');

    console.log('TODO: public user DID with backup node url here');
    console.log('remove the vault on vault node here, same node, skip');
    console.log('migration is done !!!');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// TODO: unsubscribe + unbind from DID Doc
export const unbindDID = async (did) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    const subscription = new VaultSubscription(appContext, nodeProvider);
    await subscription.unsubscribe();
  } catch (err) {
    console.error(err);
  }
};

export const createHiveNodeEnvConfig = (
  serviceDidPK,
  passpharse,
  password,
  nodeName,
  email,
  nodeDescription,
  nodeCredential,
  rpcEID = 'https://api.elastos.io/eid',
  rpcESC = 'https://api.elastos.io/esc',
  dataStorePath = './data',
  sentryEnable = true,
  sentryDSN = 'https://1dafd5d11608420aacbbf76f4288960f@o339076.ingest.sentry.io/5524839',
  paymentEnable = true,
  paymentConfigPath = './payment_config.json',
  paymentContractAddr = '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  paymentReceivingAddr = '0x93b76C16e8A2c61a3149dF3AdCbE604be1F4137b',
  atlasEnable = true,
  mongoDBUri = 'https://localhost:27018',
  ipfsNode = 'http://localhost:5020',
  ipfsGateway = 'http://ipfs-gateway.trinity-tech.io:8080',
  corsEnable = true,
  version = 'v2.3.6',
  lastCommit = 'cec7d255'
) => {
  let content = '## rpc API urls.\n';
  content += `EID_RESOLVER_URL = ${rpcEID}\n`;
  content += `ESC_RESOLVER_URL = ${rpcESC}\n`;
  content += '\n';
  content += '## private key to Hive node service DID\n';
  content += `SERVICE_DID_PRIVATE_KEY = ${serviceDidPK}\n`;
  content += `PASSPHRASE = ${passpharse}\n`;
  content += `PASSWORD = ${password}\n`;
  content += '\n';
  content += '## Credential issued by User DID to service DID\n';
  content += `NODE_CREDENTIAL = ${nodeCredential}\n`;
  content += '\n';
  content += '## local data store path\n';
  content += `DATA_STORE_PATH = ${dataStorePath}\n`;
  content += '\n';
  content += '## enable to report issue via sentry\n';
  content += `SENTRY_ENABLED = ${sentryEnable.toString().toLocaleUpperCase()}\n`;
  content += `SENTRY_DSN = ${sentryDSN}\n`;
  content += '\n';
  content += '## payment configuration\n';
  content += `PAYMENT_ENABLED = ${paymentEnable.toString().toUpperCase()}\n`;
  content += `PAYMENT_CONFIG_PATH = ${paymentConfigPath}\n`;
  content += `PAYMENT_CONTRACT_ADDRESS = ${paymentContractAddr}\n`;
  content += `PAYMENT_RECEIVING_ADDRESS = ${paymentReceivingAddr}\n`;
  content += '\n';
  content += '## using atlas service or not (mongodb service)\n';
  content += `ATLAS_ENABLED = ${atlasEnable.toString().toUpperCase()}\n`;
  content += '# MONGODB_URL = "mongodb+srv://Fred:<password>@cluster0.tt3yh.mongodb.net"\n';
  content += `MONGODB_URL = ${mongoDBUri}\n`;
  content += '\n';
  content += '## IPFS node service\n';
  content += `IPFS_NODE_URL = ${ipfsNode}\n`;
  content += `IPFS_GATEWAY_URL = ${ipfsGateway}\n`;
  content += '\n';
  content += `ENABLE_CORS = ${corsEnable.toString().toUpperCase()}\n`;
  content += '\n';
  content += '## Hive node version/commit ID.\n';
  content += `VERSION = ${version}\n`;
  content += `LAST_COMMIT = ${lastCommit}\n`;
  content += '\n';
  content += '## basic information about this node.\n';
  content += `NODE_NAME = "${nodeName}"\n`;
  content += `NODE_EMAIL = ${email}\n`;
  content += `NODE_DESCRIPTION = "${nodeDescription}"`;
  //
  const element = document.createElement('a');
  const file = new Blob([content], {
    type: 'text/plain'
  });
  element.href = URL.createObjectURL(file);
  element.download = 'hive.env';
  document.body.appendChild(element);
  element.click();
};

// ******************************* DID Credentials ************************************* //

export const getDIDDocumentFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        resolve(didDoc);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCredentialsFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(config.DIDResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        const credentials = didDoc.getCredentials();
        const properties = credentials.reduce((props, c) => {
          props[c.id.fragment] = c.subject.properties[c.id.fragment];
          return props;
        }, {});
        resolve(properties);
      })
      .catch((error) => {
        reject(error);
      });
  });

/**
 * Calls a hive script that contains a downloadable picture file, for instance a identity avatar.
 * The fetched picture is returned as a data URL "data:xxx" directly usable with Img HTML elements.
 *
 * Ex: hive://user_did@app_did/getMainIdentityAvatar ---> "data:image/png;base64,iVe89...."
 */
export const fetchHiveScriptPictureToDataUrl = async (hiveScriptUrl, did) => {
  if (!hiveScriptUrl) return null;
  return new Promise((resolve) => {
    fetchHiveScriptPicture(hiveScriptUrl, did).then((rawPicture) => {
      if (!rawPicture) resolve('');
      else resolve(rawImageToBase64DataUrl(rawPicture));
    });
  });
};

export const rawImageToBase64DataUrl = (rawImg) => {
  if (!rawImg) return '';
  const base64Data = Buffer.from(rawImg).toString('base64');
  return `data:image/png;base64,${base64Data}`;
};

/**
 * From a DID Credential subject payload, tries to extract a avatar hive url.
 * Returns this url if possible, or null otherwise.
 */
export const getHiveAvatarUrlFromDIDAvatarCredential = (avatarCredentialSubject) => {
  if (!avatarCredentialSubject) return null;
  if (avatarCredentialSubject.type && avatarCredentialSubject.type === 'elastoshive') {
    if (avatarCredentialSubject.data && avatarCredentialSubject['content-type']) {
      return avatarCredentialSubject.data;
    }
  }
  // Other cases: return nothing.
  return null;
};

/**
 * Calls a hive script that contains a downloadable picture file, for instance a identity avatar.
 * The fetched picture is returned as a raw buffer.
 *
 * Ex: hive://user_did@app_did/getMainIdentityAvatar ---> âPNGIHDR...
 */
export const fetchHiveScriptPicture = async (hiveScriptUrl, did) => {
  // DIRTY HACK START - delete this after a while. Reason: Essentials 2.1 android generates invalid script urls such as
  // ...&params={empty:0} // invalid json. - should be &params={\"empty\"":0}. DELETE this hack after a while.
  hiveScriptUrl = hiveScriptUrl.replace('params={empty:0}', 'params={"empty":0}');
  // DIRTY HACK END

  try {
    console.log('GlobalHiveService', 'Calling script url to download file', hiveScriptUrl);
    const pictureBuffer = await (await getVault(did))
      .getScriptingService()
      .downloadFileByHiveUrl(hiveScriptUrl);

    if (!pictureBuffer || pictureBuffer.length === 0) {
      console.warn(
        'GlobalHiveService',
        'Got empty data while fetching hive script picture',
        hiveScriptUrl
      );
      return null;
    }
    console.log(
      'GlobalHiveService',
      'Got data after fetching hive script picture',
      hiveScriptUrl,
      'data length:',
      pictureBuffer.length
    );
    return pictureBuffer;
  } catch (e) {
    // Can't download the asset
    console.warn('GlobalHiveService', 'Failed to download hive asset at ', hiveScriptUrl, e);
    return null;
  }
};

// ******************************* IP, Geolocation ************************************* //

export const getLocationFromIP = async (ipAddress, format) => {
  if (!ipAddress || !format) return { country: '', region: '', city: '' };
  const url = `https://ipapi.co/${ipAddress}/${format}/`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return { country: json.country_name, region: json.region, city: json.city };
  } catch (err) {
    console.error(err);
    return { country: '', region: '', city: '' };
  }
};

export const getResponseFromDNS = async (url) => {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${url}`);
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getIPFromDomain = async (url) => {
  try {
    const response = await getResponseFromDNS(url);
    if (response) {
      if (response.Answer && response.Answer.length) {
        for (let i = 0; i < response.Answer.length; i += 1) {
          const ip = response.Answer[i].data;
          if (checkIfValidIP(ip)) return ip;
        }
      } else if (response.Authority && response.Authority.length) {
        const authorityData = response.Authority[0].data.split(' ');
        const res = await getResponseFromDNS(
          authorityData.length ? authorityData[0].slice(0, -1) : ''
        );
        return res && res.Answer && res.Answer.length ? res.Answer[0].data : '';
      }
    }
    return '';
  } catch (err) {
    console.error(err);
    return '';
  }
};
