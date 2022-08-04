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
import * as fs from 'fs';
import HiveHubServer from './HiveHubServer';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import { config } from '../config';
import { getTime, reduceHexAddress, sleep } from './common';

export const getHiveNodesList = async (nid, did, withName) => {
  const nodes = await HiveHubServer.getHiveNodes(nid, did);
  const nodeList = await Promise.all(
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
        node.status = await HiveHubServer.isOnline(node.url);
      } catch (e) {
        node.status = false;
        node.ownerName = reduceHexAddress(node.owner_did, 4);
      }
      return node;
    })
  );
  return nodeList;
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

export const getActiveHiveNodeUrl = async () => {
  const nodes = await HiveHubServer.getHiveNodes();
  const activeNodes = [];
  await Promise.all(
    nodes.map(async (item) => {
      const node = { ...item };
      try {
        node.status = await HiveHubServer.isOnline(node.url);
        if (node.status && !activeNodes.includes(node.url)) activeNodes.push(node.url);
      } catch (e) {
        node.status = false;
      }
      return node;
    })
  );
  return activeNodes;
};
// ******************************************************************** //

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(
    serviceEndpoint,
    HttpClient.WITH_AUTHORIZATION,
    HttpClient.DEFAULT_OPTIONS
  );
  return { serviceEndpoint, httpClient };
};

export const getVaultSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new VaultSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getBackupSubscription = async (did, nodeProviderUrl) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new BackupSubscription(appContext, nodeProviderUrl || nodeProvider);
};

export const getSubscriptionService = async (did) => {
  const restService = await getRestService(did);
  return new SubscriptionService(restService.serviceEndpoint, restService.httpClient);
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

export const isDIDUnbinded = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider !== undefined || nodeProvider !== null || nodeProvider !== '';
};

export const getNodeProviderUrl = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return nodeProvider;
};

export const getValidNodeProviderUrl = async (appContext, did) => {
  const nodeProvider = await appContext.getProviderAddress(did);
  // console.log("original: ", nodeProvider)
  const activeNodes = await getActiveHiveNodeUrl();
  // console.log(activeNodes)
  if (!activeNodes.length) return '';
  if (activeNodes.includes(nodeProvider)) return nodeProvider;
  // console.log("updated: ", activeNodes[activeNodes.length - 1])
  return activeNodes[activeNodes.length - 1];
};

// For Test
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
};

// TODO: Find available backup node
export const findBackupNodeProvider = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  if (nodeProvider.includes('1')) return nodeProvider.replace('1', '2');
  return nodeProvider.replace('2', '1');
};

export const backupVault = async (did, backupNodeProvider) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const vault = new Vault(appContext, nodeProvider);
  const subscription = new VaultSubscription(appContext, nodeProvider);
  const subscriptionBackup = new BackupSubscription(appContext, backupNodeProvider);
  const backupService = vault.getBackupService();
  const backupVaultInfo = await subscriptionBackup.checkSubscription();
  const backupVaultServiceDid = backupVaultInfo.getServiceDid();
  backupService.setBackupContext({
    getParameter(parameter) {
      switch (parameter) {
        case 'targetAddress':
          return backupNodeProvider;
        case 'targetServiceDid':
          return backupVaultServiceDid;
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
        await instBCSHAH.getBackupCredential(srcDid, targetDid, targetHost);
        return '{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#hive-backup-credential","type":["HiveBackupCredential","VerifiableCredential"],"issuer":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq","issuanceDate":"2022-06-30T02:58:05Z","expirationDate":"2027-06-30T02:58:05Z","credentialSubject":{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","sourceHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetNodeURL":"http://localhost:5005"},"proof":{"type":"ECDSAsecp256r1","created":"2022-06-30T02:58:06Z","verificationMethod":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq#primary","signature":"4IFGnkBb9drcsD4V0GHlHZ5bSaO1CO0c69-k9d5yhTZvbEqnyXncNKhNLvKs2yaNk1ARgj6o1gUIDc74moNxWA"}}';
      } catch (e) {
        throw new HiveException(e.toString());
      }
    }
  });

  // try {
  //   await subscriptionBackup.unsubscribe();
  // } catch (e) {
  //   if (!(e instanceof NotFoundException)) {
  //     throw e;
  //   }
  // }

  try {
    // subscribe the backup service
    await subscriptionBackup.subscribe();
    console.log('subscribe a backup service.');

    // deactivate the vault to a void data changes in the backup process.
    await subscription.deactivate();
    console.log('deactivate the source vault.');

    // backup the vault data.
    await backupService.startBackup();

    // wait backup end.
    const timeLimit = Array(30).fill(0);
    const result = await Promise.all(
      // eslint-disable-next-line no-unused-vars
      timeLimit.map(async (_) => {
        const info = await backupService.checkResult();
        console.log(info.getResult());
        if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
          // go on.
        } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
          return 1;
        } else {
          throw new Error(`failed to backup: ${info.getMessage()}`);
        }
        console.log('backup in process, try to wait.');
        sleep(1000);
        return 0;
      })
    );
    console.log('backup done.');
    if (result.length && result[result.length - 1] === 1) return 1;
    return 0;
  } catch (e) {
    if (e instanceof AlreadyExistsException) return 2;
    console.error(e);
    return 0;
  }
};

export const checkBackupStatus = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const vault = new Vault(appContext, nodeProvider);
  const backupService = vault.getBackupService(vault);
  const info = await backupService.checkResult();
  return info.getResult() === BackupResultResult.RESULT_SUCCESS;
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
export const migrate = async (did, backupNodeProvider) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const vault = new Vault(appContext, nodeProvider);
  const subscription = new VaultSubscription(appContext, nodeProvider);
  const subscriptionBackup = new BackupSubscription(appContext, backupNodeProvider);
  const backupService = vault.getBackupService();
  const backupVaultInfo = await subscriptionBackup.checkSubscription();
  const backupVaultServiceDid = backupVaultInfo.getServiceDid();
  backupService.setBackupContext({
    getParameter(parameter) {
      switch (parameter) {
        case 'targetAddress':
          return backupNodeProvider;
        case 'targetServiceDid':
          return backupVaultServiceDid;
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
        await instBCSHAH.getBackupCredential(srcDid, targetDid, targetHost);
        return '{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#hive-backup-credential","type":["HiveBackupCredential","VerifiableCredential"],"issuer":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq","issuanceDate":"2022-06-30T02:58:05Z","expirationDate":"2027-06-30T02:58:05Z","credentialSubject":{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","sourceHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetHiveNodeDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetNodeURL":"http://localhost:5005"},"proof":{"type":"ECDSAsecp256r1","created":"2022-06-30T02:58:06Z","verificationMethod":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq#primary","signature":"4IFGnkBb9drcsD4V0GHlHZ5bSaO1CO0c69-k9d5yhTZvbEqnyXncNKhNLvKs2yaNk1ARgj6o1gUIDc74moNxWA"}}';
      } catch (e) {
        throw new HiveException(e.toString());
      }
    }
  });

  // try {
  //   await subscriptionBackup.unsubscribe();
  // } catch (e) {
  //   if (!(e instanceof NotFoundException)) {
  //     throw e;
  //   }
  // }

  try {
    // subscribe the backup service
    await subscriptionBackup.subscribe();
    console.log('subscribe a backup service.');

    // deactivate the vault to a void data changes in the backup process.
    await subscription.deactivate();
    console.log('deactivate the source vault.');

    // backup the vault data.
    await backupService.startBackup();

    // wait backup end.
    const timeLimit = Array(30).fill(0);
    await Promise.all(
      // eslint-disable-next-line no-unused-vars
      timeLimit.map(async (_) => {
        const info = await backupService.checkResult();
        console.log(info.getResult());
        if (info.getResult() === BackupResultResult.RESULT_PROCESS) {
          // go on.
        } else if (info.getResult() === BackupResultResult.RESULT_SUCCESS) {
          return 1;
        } else {
          throw new Error(`failed to backup: ${info.getMessage()}`);
        }
        console.log('backup in process, try to wait.');
        sleep(1000);
        return 0;
      })
    );
    console.log('backup done.');

    // promotion, same vault, so need remove vault first.
    await subscription.unsubscribe();

    // promote
    const backup = new Backup(appContext, backupNodeProvider);
    await backup.getPromotionService().promote();
    console.log('promotion over from backup data to a new vault.');

    console.log('TODO: public user DID with backup node url here');
    console.log('remove the vault on vault node here, same node, skip');
    console.log('migration is done !!!');
  } catch (err) {
    console.error(err);
  }
};

export const createHiveNodeEnvConfig = async () => {
  const content = 'this is what i want to write to file';
  fs.writeFile('/hive.env', content, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
};

// ******************************************************************** //

export const getHiveNodeInfo = async (did) => {
  const restService = await getRestService(did);
  const aboutService = new AboutService(restService.serviceEndpoint, restService.httpClient);
  const nodeInfo = await aboutService.getInfo();
  return nodeInfo;
};

export const getProvider = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  return new Provider(appContext, nodeProvider);
};

export const getAuthService = async (did) => {
  const restService = await getRestService(did);
  return new AuthService(restService.serviceEndpoint, restService.httpClient);
};

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(config.DIDResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};

// ******************************************************************** //
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
