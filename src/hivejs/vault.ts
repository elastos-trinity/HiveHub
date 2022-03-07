import SdkContext from "./testdata";
import {VaultInfo, VaultSubscriptionService, Backup, BackupSubscriptionService,
    NotFoundException, VaultServices, BackupService, PromotionService,
    ProviderService} from "@elastosfoundation/hive-js-sdk";
import HiveHubServer from "../service/hivehub";
// import {ProviderService} from "@dchagastelles/elastos-hive-js-sdk/typings/restclient/provider/providerservice";

export class VaultDetail {
    url: string;
    quota: number;
    used: number;
    pricingPlan: string;
    userDid: string;
}

export default class Vault {
    public async getSdkContext(): Promise<SdkContext> {
        return await SdkContext.getInstance();
    }

    private async getVaultSubscriptionService(hiveUrl: string): Promise<VaultSubscriptionService> {
        const sdkContext = await this.getSdkContext();
        return new VaultSubscriptionService(sdkContext.getAppContext(), hiveUrl);
    }

    private async getProviderService(hiveUrl: string): ProviderService {
        const sdkContext = await this.getSdkContext();
        return new ProviderService(sdkContext.getAppContext(), hiveUrl);
    }

    private async getBackupService(hiveUrl: string, targetUrl: string, targetDid: string): BackupService {
        const sdkContext = await this.getSdkContext();
        const vaultService = new VaultServices(sdkContext.getAppContext(), hiveUrl);
        const backupService: BackupService = vaultService.getBackupService();
        backupService.setBackupContext(sdkContext.getLoginBackupAppContext(targetUrl, targetDid));
        return backupService;
    }

    private async getBackupSubscriptionService(hiveUrl: string): Promise<BackupSubscriptionService> {
        const sdkContext = await this.getSdkContext();
        return new BackupSubscriptionService(sdkContext.getAppContext(), hiveUrl);
    }

    private async getPromotionService(hiveUrl: string): PromotionService {
        const sdkContext = await this.getSdkContext();
        const backup: Backup = new Backup(sdkContext.getAppContext(), hiveUrl);
        return backup.getPromotionService();
    }

    async getVaultDetail(hiveUrl: string): Promise<VaultDetail> {
        let vaultInfo: VaultInfo = await (await this.getVaultSubscriptionService(hiveUrl)).checkSubscription();
        console.log('get vault details with hive node: ' + vaultInfo.getServiceDid() + ', ' + vaultInfo.getPricePlan());
        return {
            url: hiveUrl,
            quota: vaultInfo.getStorageQuota(),
            used: vaultInfo.getStorageUsed(),
            pricingPlan: vaultInfo.getPricePlan(),
            userDid: vaultInfo.getServiceDid(),
        };
    }

    async createVault(hiveUrl: string): Promise<VaultDetail> {
        console.log(`create vault with hive url ${hiveUrl}`);
        let vaultInfo: VaultInfo = await (await this.getVaultSubscriptionService(hiveUrl)).subscribe();
        return {
            url: hiveUrl,
            quota: vaultInfo.getStorageQuota(),
            used: vaultInfo.getStorageUsed(),
            pricingPlan: vaultInfo.getPricePlan(),
            userDid: vaultInfo.getServiceDid(),
        };
    }

    async destroyVault(hiveUrl: string): Promise<void> {
        await (await this.getVaultSubscriptionService(hiveUrl)).unsubscribe();
    }

    /**
     * Get the vaults of the hive node.
     * @param hiveUrl
     */
    async getVaults(hiveUrl: string): Promise<Array<VaultDetail>> {
        try {
            const vaults = await (await this.getProviderService(hiveUrl)).getVaults();
            return vaults.map(e => ({
                url: hiveUrl,
                quota: e.getMaxStorage(),
                used: e.getDatabaseUseStorage() + e.getFileUseStorage(),
                pricingPlan: e.getPricingName(),
                userDid: e.getUserDid()
            }));
        } catch (e) {
            console.error(`getVaults error: ${e}`);
            return []
        }
    }

    /**
     * Get the backups of the hive node.
     * @param hiveUrl
     */
    async getBackups(hiveUrl: string): Promise<Array<VaultDetail>> {
        try {
            const backups = await (await this.getProviderService(hiveUrl)).getBackups();
            return backups.map(e => ({
                url: hiveUrl,
                quota: e.getMaxStorage(),
                used: e.getUseStorage(),
                pricingPlan: e.getPricingName(),
                userDid: e.getUserDid()
            }));
        } catch (e) {
            console.error(`getVaults error: ${e}`);
            return []
        }
    }

    /**
     * Get login user node url.
     * TODO: remove this.
     * @param did
     */
    static async getHiveUrlByDid(did: string): Promise<string> {
        return 'https://hive1.trinity-tech.io:443';
    }

    private async subscribeBackup(dstUrl: string) {
        let backupSubscriptionService = await this.getBackupSubscriptionService(dstUrl);
        try {
            return backupSubscriptionService.checkSubscription().getServiceDid();
        } catch (e) {
            if (e instanceof NotFoundException) {
                return backupSubscriptionService.subscribe().getServiceDid();
            } else {
                throw e;
            }
        }
    }

    async backup(hiveUrl: string, dstUrl: string) {
        console.log('start backup: TODO: need the BackupAppContext ready.');
        await this.waitBackupFinished();
        // const targetDid = await this.subscribeBackup(dstUrl);
        // await this.getBackupService(hiveUrl, dstUrl, targetDid).startBackup();
    }

    async migrate(hiveUrl: string, dstUrl: string) {
        console.log('start promote: TODO: need backup and update hive node url ready.');
        await this.backup(hiveUrl, dstUrl);
        // await this.waitBackupFinished();
        // await (await this.getPromotionService(dstUrl)).promote();
        // await (await this.getSdkContext()).updateLoginUserNodeUrl(dstUrl);
    }

    private async waitBackupFinished() {
        let times = 0;
        let isBackup = false;
        while (times < 5) {
            // TODO: check the result of backup here.
            await new Promise(resolve => setTimeout(resolve, 1000));
            times += 1;
        }
    }

    async getLoginUserNodes(onlineCheck=false) {
        const ownerDid = SdkContext.getLoginUserDid();
        let nodes = await HiveHubServer.getHiveNodes(null, ownerDid);
        for (const n of nodes) {
            n.online = onlineCheck ? await HiveHubServer.isOnline(n.url) : false;
        }
        return nodes;
    }
}
