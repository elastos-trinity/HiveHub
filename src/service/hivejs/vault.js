import {
  VaultInfo,
  VaultSubscription,
  Backup,
  BackupSubscription,
  NotFoundException,
  Vault as Vaults,
  BackupService,
  PromotionService,
  Provider
} from '@elastosfoundation/hive-js-sdk';
import SdkContext from './testdata';
import HiveHubServer from '../HiveHubServer';
// import {ProviderService} from "@dchagastelles/elastos-hive-js-sdk/typings/restclient/provider/providerservice";

// export class VaultDetail {
//   url;
//   quota;
//   used;
//   pricingPlan;
//   userDid;
// }

export default class Vault {
  static async getSdkContext() {
    const res = await SdkContext.getInstance();
    return res;
  }

  async getVaultSubscriptionService(hiveUrl) {
    const sdkContext = await this.getSdkContext();
    return new VaultSubscription(sdkContext.getAppContext(), hiveUrl);
  }

  async getProviderService(hiveUrl) {
    const sdkContext = await this.getSdkContext();
    return new Provider(sdkContext.getAppContext(), hiveUrl);
  }

  async getBackupService(hiveUrl, targetUrl, targetDid) {
    const sdkContext = await this.getSdkContext();
    const vaultService = new Vaults(sdkContext.getAppContext(), hiveUrl);
    const backupService = vaultService.getBackupService();
    backupService.setBackupContext(sdkContext.getLoginBackupAppContext(targetUrl, targetDid));
    return backupService;
  }

  async getBackupSubscriptionService(hiveUrl) {
    const sdkContext = await this.getSdkContext();
    return new BackupSubscription(sdkContext.getAppContext(), hiveUrl);
  }

  async getPromotionService(hiveUrl) {
    const sdkContext = await this.getSdkContext();
    const backup = new Backup(sdkContext.getAppContext(), hiveUrl);
    return backup.getPromotionService();
  }

  async getVaultDetail(hiveUrl) {
    const vaultInfo = await (await this.getVaultSubscriptionService(hiveUrl)).checkSubscription();
    console.log(
      `get vault details with hive node: ${vaultInfo.getServiceDid()}, ${vaultInfo.getPricePlan()}`
    );
    return {
      url: hiveUrl,
      quota: vaultInfo.getStorageQuota(),
      used: vaultInfo.getStorageUsed(),
      pricingPlan: vaultInfo.getPricePlan(),
      userDid: vaultInfo.getServiceDid()
    };
  }

  async createVault(hiveUrl) {
    console.log(`create vault with hive url ${hiveUrl}`);
    const vaultInfo = await (await this.getVaultSubscriptionService(hiveUrl)).subscribe();
    return {
      url: hiveUrl,
      quota: vaultInfo.getStorageQuota(),
      used: vaultInfo.getStorageUsed(),
      pricingPlan: vaultInfo.getPricePlan(),
      userDid: vaultInfo.getServiceDid()
    };
  }

  async destroyVault(hiveUrl) {
    await (await this.getVaultSubscriptionService(hiveUrl)).unsubscribe();
  }

  /**
   * Get the vaults of the hive node.
   * @param hiveUrl
   */
  async getVaults(hiveUrl) {
    try {
      const vaults = await (await this.getProviderService(hiveUrl)).getVaults();
      return vaults.map((e) => ({
        url: hiveUrl,
        quota: e.getMaxStorage(),
        used: e.getDatabaseUseStorage() + e.getFileUseStorage(),
        pricingPlan: e.getPricingName(),
        userDid: e.getUserDid()
      }));
    } catch (e) {
      console.error(`getVaults error: ${e}`);
      return [];
    }
  }

  /**
   * Get the backups of the hive node.
   * @param hiveUrl
   */
  async getBackups(hiveUrl) {
    try {
      const backups = await (await this.getProviderService(hiveUrl)).getBackups();
      return backups.map((e) => ({
        url: hiveUrl,
        quota: e.getMaxStorage(),
        used: e.getUseStorage(),
        pricingPlan: e.getPricingName(),
        userDid: e.getUserDid()
      }));
    } catch (e) {
      console.error(`getVaults error: ${e}`);
      return [];
    }
  }

  /**
   * Get login user node url.
   * TODO: remove this.
   * @param did
   */
  static async getHiveUrlByDid(did) {
    return 'https://hive1.trinity-tech.io:443';
  }

  async subscribeBackup(dstUrl) {
    const backupSubscriptionService = await this.getBackupSubscriptionService(dstUrl);
    try {
      return backupSubscriptionService.checkSubscription().getServiceDid();
    } catch (e) {
      if (e instanceof NotFoundException) {
        return backupSubscriptionService.subscribe().getServiceDid();
      }
      throw e;
    }
  }

  async backup(hiveUrl, dstUrl) {
    console.log('start backup: TODO: need the BackupAppContext ready.');
    await this.waitBackupFinished();
    // const targetDid = await this.subscribeBackup(dstUrl);
    // await this.getBackupService(hiveUrl, dstUrl, targetDid).startBackup();
  }

  async migrate(hiveUrl, dstUrl) {
    console.log('start promote: TODO: need backup and update hive node url ready.');
    await this.backup(hiveUrl, dstUrl);
    // await this.waitBackupFinished();
    // await (await this.getPromotionService(dstUrl)).promote();
    // await (await this.getSdkContext()).updateLoginUserNodeUrl(dstUrl);
  }

  static async waitBackupFinished() {
    // let times = 0;
    const isBackup = false;
    // while (times < 5) {
    // TODO: check the result of backup here.
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    // times += 1;
    // }
  }

  static async getLoginUserNodes(onlineCheck = false) {
    const ownerDid = SdkContext.getLoginUserDid();
    const nodes = await HiveHubServer.getHiveNodes(null, ownerDid);

    await Promise.all(
      nodes.map(async (n) => {
        const isOnline = await HiveHubServer.isOnline(n.url);
        n.online = onlineCheck ? isOnline : false;
      })
    );
    return nodes;
  }
}
