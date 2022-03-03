import SdkContext from "./testdata";
import {VaultInfo, VaultSubscriptionService} from "@dchagastelles/elastos-hive-js-sdk";
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

    // private async getProviderService(hiveUrl: string) {
    //     const sdkContext = await this.getSdkContext();
    //     return new ProviderService(sdkContext.getAppContext(), hiveUrl);
    // }

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
        // try {
        //     const vaults = await (await this.getProviderService(hiveUrl)).getVaults();
        //     return vaults.map(e => ({
        //         url: hiveUrl,
        //         quota: e.getMaxStorage(),
        //         used: e.getDatabaseUseStorage() + e.getFileUseStorage(),
        //         pricingPlan: e.getPricingName(),
        //         userDid: e.getUserDid()
        //     }));
        // } catch (e) {
        //     console.error(`getVaults error: ${e}`);
        //     return []
        // }
        return [{
            url: hiveUrl,
            quota: 512,
            used: 20,
            pricingPlan: 'Free',
            userDid: 'did1'
        }, {
            url: hiveUrl,
            quota: 512,
            used: 100,
            pricingPlan: 'Free',
            userDid: 'did2'
        }];
    }

    /**
     * Get the backups of the hive node.
     * @param hiveUrl
     */
    async getBackups(hiveUrl: string): Promise<Array<VaultDetail>> {
        // try {
        //     const backups = await (await this.getProviderService(hiveUrl)).getBackups();
        //     return backups.map(e => ({
        //         url: hiveUrl,
        //         quota: e.getMaxStorage(),
        //         used: e.getUseStorage(),
        //         pricingPlan: e.getPricingName(),
        //         userDid: e.getUserDid()
        //     }));
        // } catch (e) {
        //     console.error(`getVaults error: ${e}`);
        //     return []
        // }
        return this.getVaults(hiveUrl);
    }

    /**
     * Get login user node url.
     * TODO: remove this.
     * @param did
     */
    static async getHiveUrlByDid(did: string): Promise<string> {
        return 'https://hive1.trinity-tech.io:443';
    }

    async backup(hiveUrl: string, dstUrl: string) {
        await (await this.getSdkContext()).getBackupService().startBackup();
    }

    async migrate(hiveUrl: string, dstUrl: string) {
        await (await this.getSdkContext()).getBackupService().startBackup();
        // await this.waitBackupFinished();
        // await (await this.getSdkContext()).newBackup().getPromotionService().promote();
        await (await this.getSdkContext()).updateLoginUserNodeUrl(dstUrl);
    }

    private async waitBackupFinished() {
        let times = 0;
        let isBackup = false;
        while (times < 10) {
            // TODO: check the result of backup here.
            await new Promise(resolve => setTimeout(resolve, 1000));
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
