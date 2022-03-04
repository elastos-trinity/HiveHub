import {
    Claims, DefaultDIDAdapter, DIDBackend,
    DIDDocument,
    JWTParserBuilder,
    VerifiableCredential,
    VerifiablePresentation, DID
} from "@elastosfoundation/did-js-sdk";
import {AppContext, BackupService, HiveException, VaultServices, Backup} from "@elastosfoundation/hive-js-sdk";
import {AppDID} from "./did/appdid";
import {UserDID} from "./did/userdid";
import {connectivity, DID as ConDID} from "@elastosfoundation/elastos-connectivity-sdk-js";
import ClientConfig from "./config/clientconfig";
import {NoLoginError} from "./error";

export default class SdkContext {
    public static INSTANCE: SdkContext;
    public static readonly DID_NET = "mainnet";
    public static readonly APPLICATION_DID = 'did:elastos:iqtWRVjz7gsYhyuQEb1hYNNmWQt1Z9geXg';
    public static readonly RESOLVE_CACHE = "data/didCache";
    public static readonly USER_DIR = '/data/userDir';
    private static readonly isTest: boolean = false;

    // for test.
    private isInit: boolean = false;
    private clientConfig: any = ClientConfig.CUSTOM;
    private userDid: UserDID;
    private callerDid: UserDID;
    private appInstanceDid: AppDID;

    private context: AppContext;
    private callerContext: AppContext;
    private appIdCredential: VerifiableCredential;
    private curLoginUserDidStr: string;
    private curLoginUserNodeUrl: string; // maybe null

    static async getInstance(): Promise<SdkContext> {
        if (!SdkContext.INSTANCE) {
            SdkContext.INSTANCE = new SdkContext();
        }
        if (SdkContext.isTest)
            await SdkContext.INSTANCE.initByTestDid();
        else
            await SdkContext.INSTANCE.initByLoginDid();
        return SdkContext.INSTANCE;
    }

    public constructor() {
        connectivity.setApplicationDID(SdkContext.APPLICATION_DID);
        DIDBackend.initialize(new DefaultDIDAdapter(SdkContext.DID_NET));
        AppContext.setupResolver(SdkContext.DID_NET, SdkContext.RESOLVE_CACHE);
    }

    /**
     * for test.
     */
    async initByTestDid(): Promise<void> {
        console.log('Init SDKContext by preset user did.');
        if (this.isInit) {
            return;
        }

        let applicationConfig = this.clientConfig.application;
        this.appInstanceDid = await AppDID.create(applicationConfig.name,
            applicationConfig.mnemonics2,
            applicationConfig.passPhrase,
            applicationConfig.storepass,
            applicationConfig.did);

        let userConfig = this.clientConfig.user;
        this.userDid = await UserDID.create(userConfig.name,
            userConfig.mnemonic,
            userConfig.passPhrase,
            userConfig.storepass,
            userConfig.did);

        // TestData.LOG.trace("UserDid created");
        let userConfigCaller = this.clientConfig.cross.user;
        this.callerDid = await UserDID.create(userConfigCaller.name,
            userConfigCaller.mnemonic,
            userConfigCaller.passPhrase,
            userConfigCaller.storepass,
            userConfigCaller.did);

        //Application Context
        let owner = this;
        this.context = await AppContext.build({
            getLocalDataDir() : string {
                return owner.getLocalStorePath();
            },

            async getAppInstanceDocument() : Promise<DIDDocument>  {
                try {
                    return await owner.getAppInstanceDIDDoc();
                } catch (e) {
                    console.error(`failed to get app instance doc: ${e}`);
                }
                return null;
            },

            async getAuthorization(jwtToken : string) : Promise<string> {
                try {
                    let claims : Claims = (await new JWTParserBuilder().build().parse(jwtToken)).getBody();
                    if (claims == null) {
                        throw new HiveException("Invalid jwt token as authorization.");
                    }

                    let presentation = await owner.appInstanceDid.createPresentation(
                        await owner.userDid.issueDiplomaFor(owner.appInstanceDid),
                        claims.getIssuer(), claims.get("nonce") as string);

                    // TestData.LOG.debug("TestData->presentation: " + presentation.toString(true));
                    return await owner.appInstanceDid.createToken(presentation,  claims.getIssuer());
                } catch (e) {
                    // TestData.LOG.info("TestData->getAuthorization error: " + e);
                    console.log("TestData->getAuthorization error: " + e + ', ' + e.stack);
                    // TestData.LOG.error(e.stack);
                }
            }
        }, owner.userDid.getDid().toString());

        this.callerContext = await AppContext.build({
            //@Override
            getLocalDataDir(): string {
                return owner.getLocalStorePath();
            },

            async getAppInstanceDocument() : Promise<DIDDocument>  {
                try {
                    return await owner.appInstanceDid.getDocument();
                } catch (e) {
                    // TestData.LOG.error(e.stack);
                }
                return null;
            },

            async getAuthorization(jwtToken : string) : Promise<string>  {
                try {
                    return owner.getAuthAuthorization(jwtToken);
                } catch (e) {
                    throw new HiveException(e.getMessage(), e);
                }
            }
        }, this.callerDid.getDid().toString());
    }

    getProviderAddress(): string {
        return this.clientConfig.node.provider;
    }

    async getAppInstanceDIDDoc(): Promise<DIDDocument> {
        return await this.appInstanceDid.getDocument();
    }

    /**
     * for real
     * @private
     */
    private async initByLoginDid(): Promise<void> {
        console.log('Init SDKContext by essentials login user did.');
        const userDidStr = SdkContext.getLoginUserDid();
        if (!userDidStr) {
            throw new NoLoginError('Can not initialize SdkContext.');
        } else if (userDidStr === this.curLoginUserDidStr) {
            return;
        }
        this.context = await this.getLoginAppContext();
        this.curLoginUserDidStr = userDidStr;
        this.curLoginUserNodeUrl = await this.getLoginUserNodeUrl();
    }

    getAppContext(): AppContext {
        return this.context;
    }

    public getLocalStorePath(): string {
        return `${SdkContext.USER_DIR}/data/store/${this.clientConfig.node.storePath}`;
    }

    private getTargetProviderAddress(): string {
        return this.clientConfig.node.targetHost;
    }

    private getTargetServiceDid(): string {
        return this.clientConfig.node.targetDid;
    }

    public newVault(): VaultServices {
        return new VaultServices(this.context, this.getProviderAddress());
    }

    // public newBackup(): Backup {
    //     return new Backup(this.context, this.getProviderAddress());
    // }

    public getBackupService(): BackupService {
        const backupService = this.newVault().getBackupService();
        const self = this;
        backupService.setBackupContext({
            getParameter(parameter:string): string {
                switch (parameter) {
                    case "targetAddress":
                        return self.getTargetProviderAddress();

                    case "targetServiceDid":
                        return self.getTargetServiceDid();

                    default:
                        break;
                }
                return null;
            },

            getType(): string {
                return null;
            },

            async getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
                try {
                    return (await self.userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid)).toString();
                } catch (e) {
                    throw new HiveException(e.toString());
                }

            }
        });
        return backupService;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // For login user ConDID.

    async getLoginAppContext() {
        let owner = this;
        const userDidStr = SdkContext.getLoginUserDid();
        const context = await AppContext.build({
            getLocalDataDir() : string {
                return owner.getLoginLocalStorePath();
            },

            async getAppInstanceDocument() : Promise<DIDDocument>  {
                try {
                    console.log(`enter getAppInstanceDocument() of the app context.`);
                    return await SdkContext.getLoginAppInstanceDidDoc();
                } catch (e) {
                    console.error(`Failed to get application instance did documentation.`);
                    return null;
                }
            },

            async getAuthorization(jwtToken : string) : Promise<string> {
                try {
                    console.log(`enter getAuthorization() of the app context.`);
                    return await owner.getAuthAuthorization(jwtToken);
                } catch (e) {
                    console.error(`TestData->getAuthorization error: ${e}`);
                    return null;
                }
            }
        }, userDidStr);
        return context;
    }

    getLoginBackupAppContext(targetUrl: string, targetDid: string) {
        const self = this;
        return {
            getParameter(parameter:string): string {
                switch (parameter) {
                    case "targetAddress":
                        return targetUrl;

                    case "targetServiceDid":
                        return targetDid;

                    default:
                        break;
                }
                return null;
            },

            getType(): string {
                return null;
            },

            async getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
                try {
                    // TODO: make this work with connectivity sdk after supported this.
                    return (await self.userDid.issueBackupDiplomaFor(srcDid, targetHost, targetDid)).toString();
                } catch (e) {
                    throw new HiveException(e.toString());
                }
            }
        }
    }

    public getLoginLocalStorePath(): string {
        return `${SdkContext.USER_DIR}/data/store/develop`;
    }

    static async getLoginAppInstanceDidDoc(): Promise<DIDDocument> {
        console.log('enter SdkContext.getLoginAppInstanceDidDoc()')
        const didAccess = new ConDID.DIDAccess();
        const info = await didAccess.getOrCreateAppInstanceDID();
        return await info.didStore.loadDid(info.did.toString());
    }

    private async getAuthAuthorization(challenge: string): Promise<string> {
        console.log('enter SdkContext.getAuthAuthorization()')
        let claims : Claims = (await new JWTParserBuilder().build().parse(challenge)).getBody();
        if (claims == null) {
            throw new HiveException("Invalid jwt token as authorization.");
        }
        if (!claims.getIssuer() || !(claims.get("nonce") as string)) {
            throw new HiveException('The received authentication JWT token does not contain iss or nonce');
        }
        let nonce = claims.get("nonce") as string;
        let hiveDid = claims.getIssuer();
        this.appIdCredential = await this.checkAppIdCredentialStatus(this.appIdCredential);
        if (!this.appIdCredential) {
            throw new HiveException('Can not get the credential for the application instance.');
        }
        const storePassword = 'password';
        let vp: VerifiablePresentation = await AppDID.createVerifiablePresentation(
            this.appIdCredential, hiveDid, nonce, storePassword);
        return await AppDID.createChallengeResponse(vp, hiveDid, storePassword);
    }

    private checkAppIdCredentialStatus(appIdCredential): Promise<VerifiableCredential> {
        return new Promise(async (resolve, reject) => {
            if (this.checkCredentialValid(appIdCredential)) {
                console.log(`Credential valid, credential is ${this.appIdCredential}`);
                resolve(appIdCredential);
                return;
            }

            console.log('checkAppIdCredentialStatus: Credential invalid, Getting app identity credential');

            let didAccess = new ConDID.DIDAccess();
            try {
                let credential = await didAccess.getExistingAppIdentityCredential();
                if (credential) {
                    console.log(`Get app identity credential ${credential}`);
                    resolve(credential);
                    return;
                }

                console.log('checkAppIdCredentialStatus: getExistingAppIdentityCredential, failed')

                credential = await didAccess.generateAppIdCredential();
                if (credential) {
                    console.log(`Generate app identity credential, credential is ${credential}`);
                    resolve(credential);
                    return;
                }

                let error = 'Get app identity credential error, credential is ' + JSON.stringify(credential);
                console.error(error);
                reject(error);
            } catch (error) {
                console.error(`Failed to check the application credential: ${error}`);
                reject(error);
            }
        });
    }

    private checkCredentialValid(appIdCredential): boolean {
        return appIdCredential && appIdCredential.getExpirationDate().valueOf() >= new Date().valueOf();
    }

    public async getLoginUserNodeUrl(): Promise<string> {
        const userDidStr = SdkContext.getLoginUserDid();
        if (!userDidStr) {
            throw new NoLoginError('Can not get the hive node url of the login user did.');
        }
        const userDidDocument = await DID.from(userDidStr).resolve();
        const service = userDidDocument.getService(`${userDidStr}#hivevault`);
        if (!service) {
            return null;
        }
        return service.getServiceEndpoint() + ':443';
    }

    public async updateLoginUserNodeUrl(url: string): Promise<void> {
        // TODO: Need essentials connector support first.
        console.warn(`TODO: publish the node url (${url}) for login user.`);
    }

    public static getLoginUserDid(): string {
        const did = localStorage.getItem('did');
        if (!did) {
            return null;
        }
        return `did:elastos:${did}`;
    }

    public static isLogined(): boolean {
        return !!SdkContext.getLoginUserDid();
    }
}
