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
  Backup
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

export const getHiveNodeInfo = async (did, nodeProvider, throwEx = false) => {
  try {
    const serviceEndpoint = await getServiceEndpoint(did, nodeProvider);
    return new AboutService(serviceEndpoint).getInfo();
  } catch (err) {
    if (throwEx) throw err;
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
    const total = (vaultInfo.getStorageQuota() / 1024 / 1024).toFixed(2) * 1.0;
    const used = (vaultInfo.getStorageUsed() / 1024 / 1024).toFixed(2) * 1.0;
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
    return new ServiceEndpoint(appContext, nodeProviderUrl || nodeProvider);
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

export const bindDid = async (targetNodeUrl) => {
  try {
    const didAccess = new ConnDID.DIDAccess();
    const result = await didAccess.updateHiveVaultAddress(targetNodeUrl, '');
    if (result === 'published') return true;
    console.error('Failed to publish the target hive url for user did.');
    return false;
  } catch (e) {
    console.error(e);
    return false;
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
  // subscribe the backup service.
  const appContext = await getAppContext(did);
  if (!appContext) {
    throw new Error('Can not get backup credential, please confirm on the Essentials app.');
  }
  const backupService = new Vault(appContext).getBackupService();
  const targetBackupSubscription = new BackupSubscription(appContext, targetNodeUrl);
  try {
    await targetBackupSubscription.subscribe();
  } catch (err) {
    if (err instanceof AlreadyExistsException) {
      console.debug(`The backup service is already exists on the target node.`);
    } else {
      throw new Error(`Failed to subscribe the backup service on the target hive node: ${err}`);
    }
  }

  // prepare backup service
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
      const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
      // TODO: EE return wrong format credential, just place a correct one to make demo work.
      return instBCSHAH.getBackupCredential(srcDid, targetDid, targetHost);
    }
  });

  // deactivate the vault to avoid data changes in the backup process.
  const vaultSubscription = new VaultSubscription(appContext);
  await vaultSubscription.deactivate();
  console.log('deactivate the source vault.');

  // do backup
  const maxTimes = 10 * 60;
  let count = 0;
  try {
    await backupService.startBackup();

    // wait backup end.
    while (count < maxTimes) {
      // eslint-disable-next-line no-await-in-loop
      const info = await backupService.checkResult();
      if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
        // go on.
      } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
        return;
      } else {
        throw new Error(`Failed to backup: ${info.getMessage()}`);
      }
      count += 1;
      console.log('backup in process, try to wait.');
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  } catch (e) {
    throw new HiveException(e.toString());
  } finally {
    await vaultSubscription.activate();
  }

  if (count >= maxTimes) {
    throw new Error('Timeout for the backup process.');
  }

  console.log('backup done.');
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
  await backupVault(did, targetNodeUrl);

  // promote
  const appContext = await getAppContext(did);
  if (!appContext) {
    throw new Error('Can not get backup credential, please confirm on the Essentials app.');
  }

  const backup = new Backup(appContext, targetNodeUrl);
  await backup.getPromotionService().promote();
  console.log('promotion over from backup data to a new vault.');

  const didAccess = new ConnDID.DIDAccess();
  const result = await didAccess.updateHiveVaultAddress(targetNodeUrl, '');
  if (!result) {
    throw new Error('Failed to publish the target hive url for the user did.');
  }

  // promotion, same vault, so need remove vault first.
  try {
    await new VaultSubscription(appContext).unsubscribe();
  } catch (e) {
    console.error('Failed to remove old vault.');
  }

  console.log('migration is done !!!');
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
    : 'https://ipfs-testnet.trinity-tech.io';
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
MONGODB_URL = mongodb://hivemongodb:27017
IPFS_NODE_URL = http://hiveipfs:5001
IPFS_GATEWAY_URL = ${ipfsGatewayUrl}
ENABLE_CORS = True
VERSION = v2.9.2
LAST_COMMIT = e2621af
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
    return {
      country: json.country_name,
      region: json.region,
      city: json.city,
      latitude: json.latitude,
      longitude: json.longitude
    };
  } catch (err) {
    console.error(err);
    return { country: '', region: '', city: '', latitude: undefined, longitude: undefined };
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
