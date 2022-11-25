import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService,
  AlreadyExistsException,
  Vault,
  InsertOptions,
  BackupResultResult,
  HiveException,
  Backup,
  VaultNotFoundException
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import { DID as ConnDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import { config } from '../config';
import { checkIfValidIP, getTime, reduceHexAddress, sleep } from './common';

// ******************************* Hive Node (HiveHub Server) ************************************* //

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

export const getHiveNodeInfo = async (did, nodeProvider) => {
  try {
    const serviceEndpoint = await getServiceEndpoint(did, nodeProvider);
    return new AboutService(serviceEndpoint).getInfo();
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getMyHiveNodeDetails = async (did, nodeProviderUrl) => {
  try {
    const provider = await getProvider(did, nodeProviderUrl);
    const results = await Promise.all([provider.getVaults(), provider.getBackups()]);
    return { vaults: results[0], backups: results[1] };
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
    const total = (vaultInfo.getStorageQuota() / 1024 / 1024, 2).toFixed * 1.0;
    const used = (vaultInfo.getStorageUsed() / 1024 / 1024, 2).toFixed * 1.0;
    const created = getTime(new Date(vaultInfo.getCreated().toString()).getTime());
    const time = `${created.date} ${created.time}`;
    const id = 0;
    const serviceDid = vaultInfo.getServiceDid();
    const credentials = await getCredentialsFromDID(did);
    const ownerName = credentials.name ? credentials.name : reduceHexAddress(did, 4);
    return { ...vaultInfo, id, name, total, used, time, ownerName, serviceDid };
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

export const getServiceEndpoint = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    const serviceEndpoint = new ServiceEndpoint(appContext, nodeProviderUrl || nodeProvider);
    return serviceEndpoint;
  } catch (err) {
    console.error(err);
    return undefined;
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

export const getDappsOnVault = async (did, nodeProviderUrl) => {
  try {
    const valutSubscription = await getVaultSubscription(did, nodeProviderUrl);
    const appStats = await valutSubscription.getAppStats();
    return appStats;
  } catch (err) {
    console.error(err);
    return [];
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
    const serviceEndpoint = await getServiceEndpoint(did, undefined);
    return new SubscriptionService(serviceEndpoint);
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
    const serviceEndpoint = await getServiceEndpoint(did, undefined);
    return new AuthService(serviceEndpoint);
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
    return '';
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
    return '';
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
  const appContext = await getAppContext(did);
  // const nodeProvider = await appContext.getProviderAddress(did);
  // Vault to back up
  const vault = new Vault(appContext);
  const vaultSubscription = new VaultSubscription(appContext);
  const backupService = vault.getBackupService();
  // Backup Service on target Node
  const targetBackupSubscription = new BackupSubscription(appContext, targetNodeUrl);
  // subscribe the backup service
  try {
    await targetBackupSubscription.subscribe();
  } catch (err) {
    if (err instanceof AlreadyExistsException) {
      // await targetBackupSubscription.unsubscribe();
      // await targetBackupSubscription.subscribe();
      console.debug(`The backup service is already exists on the target node.`);
    } else {
      console.error(`Failed to subscribe the backup service on the target hive node: ${err}`);
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
      } catch (e) {
        throw new HiveException(e.toString());
      }
    }
  });

  // deactivate the vault to avoid data changes in the backup process.
  await vaultSubscription.deactivate();
  console.log('deactivate the source vault.');

  try {
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
  } catch (e) {
    console.error(`Failed to backup: ${e}`);
    return false;
  } finally {
    await vaultSubscription.activate();
  }
  console.log('backup done.');
  return 1;
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
 * @return true if successfully, false if failed.
 */

export const migrateVault = async (did, targetNodeUrl) => {
  const appContext = await getAppContext(did);
  // const nodeProvider = await appContext.getProviderAddress(did);
  // Vault to back up
  const vault = new Vault(appContext);
  const vaultSubscription = new VaultSubscription(appContext);
  const backupService = vault.getBackupService();
  // Remove vault on target node
  const targetVaultSubscription = new VaultSubscription(appContext, targetNodeUrl);
  try {
    const targetVaultInfo = await targetVaultSubscription.checkSubscription();
    if (targetVaultInfo) await targetVaultSubscription.unsubscribe();
  } catch (err) {
    if (err instanceof VaultNotFoundException) {
      console.debug(`No vault on target hive node.`);
    } else {
      console.error(`Failed to try to unsubscribe the vault of the target node: ${err}`);
      return false;
    }
  }
  // Backup Service on target Node
  const targetBackupSubscription = new BackupSubscription(appContext, targetNodeUrl);
  // subscribe the backup service
  try {
    await targetBackupSubscription.subscribe();
  } catch (err) {
    if (err instanceof AlreadyExistsException) {
      // await targetBackupSubscription.unsubscribe();
      // await targetBackupSubscription.subscribe();
      console.debug(`The backup service is already exists on the target node.`);
    } else {
      console.error(`Failed to subscribe the backup service on the target hive node: ${err}`);
      return false;
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

  try {
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
  } catch (e) {
    console.error(`Failed to backup: ${e}`);
    return false;
  } finally {
    await vaultSubscription.activate();
  }

  // promote
  const backup = new Backup(appContext, targetNodeUrl);
  await backup.getPromotionService().promote();
  console.log('promotion over from backup data to a new vault.');

  console.log('TODO: public user DID with backup node url here');
  const didAccess = new ConnDID.DIDAccess();
  const result = await didAccess.updateHiveVaultAddress(targetNodeUrl, '');
  if (!result) {
    console.error('Failed to publish the target hive url for user did.');
    return false;
  }

  // promotion, same vault, so need remove vault first.
  console.log('remove the vault on vault node here, same node, skip');
  await vaultSubscription.unsubscribe();

  console.log('migration is done !!!');
  return true;
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
  serviceDIDContent,
  passPhrase,
  password,
  nodeCredential,
  paymentReceivingAddress,
  nodeName,
  nodeEmail,
  nodeDescription
) => {
  const eidUrl = config.IsProductEnv
    ? 'https://api.elastos.io/eid'
    : 'https://api-testnet.elastos.io/eid';
  const escUrl = config.IsProductEnv
    ? 'https://api.elastos.io/esc'
    : 'https://api-testnet.elastos.io/esc';
  const paymentContractAddress = config.IsProductEnv
    ? '0x59E9f4ff80f3B3A4810b5264EB713DC04F9DFC31'
    : '0x81897263EC51A2314d256703b2B9f57664B772a9';
  const ipfsGatewayUrl = config.IsProductEnv
    ? 'https://ipfs.triniy-tech.io'
    : 'https://ipfs-test.trinity-feeds.app';
  const content = `EID_RESOLVER_URL = ${eidUrl}
ESC_RESOLVER_URL = ${escUrl}
SERVICE_DID_PRIVATE_KEY = ${serviceDIDContent}
PASSPHRASE = ${passPhrase}
PASSWORD = ${password}
NODE_CREDENTIAL = ${nodeCredential}
DATA_STORE_PATH = ./data
SENTRY_ENABLED = False
SENTRY_DSN =
PAYMENT_ENABLED = ${paymentReceivingAddress ? 'True' : 'False'}
PAYMENT_CONFIG_PATH = ./payment_config.json
PAYMENT_CONTRACT_ADDRESS = ${paymentContractAddress}
PAYMENT_RECEIVING_ADDRESS = ${paymentReceivingAddress}
ATLAS_ENABLED = False
MONGODB_URL = mongodb://localhost:27017
IPFS_NODE_URL = http://localhost:5001
IPFS_GATEWAY_URL = ${ipfsGatewayUrl}
ENABLE_CORS = True
VERSION = v2.9.1
LAST_COMMIT = cec7d255
NODE_NAME = ${nodeName}
NODE_EMAIL = ${nodeEmail}
NODE_DESCRIPTION = ${nodeDescription} `;
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
