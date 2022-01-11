import SdkContext from "./testdata";
import ClientConfig from "./config/clientconfig";
import {VaultInfo, VaultSubscriptionService} from "@dchagastelles/elastos-hive-js-sdk";


export class VaultDetail {
    quota: number;
    used: number;
    pricingPlan: string;
}


export default class Vault {
    private static instance: Vault = null;

    private sdkContext: SdkContext;
    private vaultSubscriptionService: VaultSubscriptionService;

    public static async getInstance(): Promise<Vault> {
        if (!Vault.instance) {
            Vault.instance = new Vault();
            await Vault.instance.init();
        }
        return Vault.instance;
    }

    private constructor() {
        // do nothing.
    }

    private async init(): Promise<void> {
        this.sdkContext = await SdkContext.getInstance("vault subscribe.test", ClientConfig.CUSTOM, SdkContext.USER_DIR);
    }

    private getVaultSubscriptionService(hiveUrl: string) {
        return new VaultSubscriptionService(this.sdkContext.getAppContext(), hiveUrl);
    }

    async hello(): Promise<void> {
        // this.init().then((res) => alert('hello hive js'), (res) => alert('error hive js'));
        // this.init().then(async (res) => {
        //     this.vaultSubscriptionService.checkSubscription();
        // }, (res) => alert('error hive js'));
        // await this.init();
        let vaultInfo = await this.vaultSubscriptionService.checkSubscription();
        alert('hello hive js' + vaultInfo.getServiceDid());

    }

    async getVaultDetail(hiveUrl: string): Promise<VaultDetail> {
        let vaultInfo: VaultInfo = await this.getVaultSubscriptionService(hiveUrl).checkSubscription();
        console.log('get vault details with hive node did: ' + vaultInfo.getServiceDid());
        return {
            quota: vaultInfo.getStorageQuota(),
            used: vaultInfo.getStorageUsed(),
            pricingPlan: vaultInfo.getPricePlan()
        };
    }

    async createVault(hiveUrl: string): Promise<VaultDetail> {
        let vaultInfo: VaultInfo = await this.getVaultSubscriptionService(hiveUrl).subscribe();
        return {
            quota: vaultInfo.getStorageQuota(),
            used: vaultInfo.getStorageUsed(),
            pricingPlan: vaultInfo.getPricePlan()
        };
    }

    async destroyVault(hiveUrl: string): Promise<void> {
        await this.getVaultSubscriptionService(hiveUrl).unsubscribe();
    }

    async getVaults(hiveUrl: string): Promise<Array<VaultDetail>> {
        return [{
            quota: 512,
            used: 20,
            pricingPlan: 'Free',
        }, {
            quota: 512,
            used: 100,
            pricingPlan: 'Free',
        }];
    }
}
