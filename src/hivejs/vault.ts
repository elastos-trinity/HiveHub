import SdkContext from "./testdata";
import ClientConfig from "./config/clientconfig";
import {VaultInfo, VaultSubscriptionService} from "@dchagastelles/elastos-hive-js-sdk";


export default class Vault {
    private sdkContext: SdkContext;
    private vaultSubscriptionService: VaultSubscriptionService;

    constructor() {
    }

    async init(): Promise<void> {
        if (!this.sdkContext) {
            this.sdkContext = await SdkContext.getInstance("vault subscribe.test", ClientConfig.CUSTOM, SdkContext.USER_DIR);
            this.vaultSubscriptionService = new VaultSubscriptionService(
                this.sdkContext.getAppContext(),
                this.sdkContext.getProviderAddress());
        }
    }

    async hello(): Promise<void> {
        // this.init().then((res) => alert('hello hive js'), (res) => alert('error hive js'));
        // this.init().then(async (res) => {
        //     this.vaultSubscriptionService.checkSubscription();
        // }, (res) => alert('error hive js'));
        await this.init();
        let vaultInfo = await this.vaultSubscriptionService.checkSubscription();
        alert('hello hive js' + vaultInfo.getServiceDid());

    }
}
