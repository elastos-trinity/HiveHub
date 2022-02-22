import SdkContext from "./testdata";
import {VaultInfo, VaultSubscriptionService} from "@dchagastelles/elastos-hive-js-sdk";
import {lstatSync, readdirSync} from "./bfs";

export class VaultDetail {
    quota: number;
    used: number;
    pricingPlan: string;
    userDid: string;
}

export default class Vault {
    private async getSdkContext(): Promise<SdkContext> {
        return await SdkContext.getInstance();
    }

    private async getVaultSubscriptionService(hiveUrl: string): Promise<VaultSubscriptionService> {
        const sdkContext = await this.getSdkContext();
        return new VaultSubscriptionService(sdkContext.getAppContext(), hiveUrl);
    }

    readDirTree(root: string): void {
        const files = readdirSync(root);
        for (const name of files) {
            const childrenDir = root === '/' ? `/${name}` : `${root}/${name}`;
            if (!lstatSync(childrenDir).isDirectory()) {
                console.log(`get file: ${childrenDir}`);
                continue;
            }
            console.log(`try dir: ${childrenDir}`);
            this.readDirTree(childrenDir);
        }
    }

    async hello(): Promise<void> {
        // this.init().then((res) => alert('hello hive js'), (res) => alert('error hive js'));
        // this.init().then(async (res) => {
        //     this.vaultSubscriptionService.checkSubscription();
        // }, (res) => alert('error hive js'));
        // await this.init();

        console.log('enter hello');

        // const files = readdirSync('/');
        // console.log(`all files: ${files}`);

        this.readDirTree('/');

        try {
            let vaultInfo = await (await this.getVaultSubscriptionService('http://localhost:5004')).checkSubscription();
            alert('hello hive js' + vaultInfo.getServiceDid());
        } catch (e) {
            console.log(`failed in hello: ${e}`);
        }

        console.log('leave hello');
    }

    async getVaultDetail(hiveUrl: string): Promise<VaultDetail> {
        let vaultInfo: VaultInfo = await (await this.getVaultSubscriptionService(hiveUrl)).checkSubscription();
        console.log('get vault details with hive node: ' + vaultInfo.getServiceDid() + ', ' + vaultInfo.getPricePlan());
        return {
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
        return [{
            quota: 512,
            used: 20,
            pricingPlan: 'Free',
            userDid: 'did1'
        }, {
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
        return await this.getVaults(hiveUrl);
    }

    /**
     * Get login user node url.
     * TODO: remove this.
     * @param did
     */
    static async getHiveUrlByDid(did: string): Promise<string> {
        return 'http://localhost:5004';
    }
}
